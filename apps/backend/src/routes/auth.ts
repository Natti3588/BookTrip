/**
 * 認証のルーティング（/api/auth）
 * - 認証方式: HTTP Only Cookieでセッションを保存
 * - 状態管理: DB のセッションテーブル（lib/auth.tsの createSession / validateSession / deleteSession）
 * - セキュリティ方針:
 *   - パスワードは bcrypt でハッシュ化
 *   - loginは「ユーザーが存在しない」と「パスワード不一致」を同じエラーで返す
 *   - /me は select　でpasswordHash を返さない
 */

import { zValidator } from "@hono/zod-validator"
import { Prisma, prisma } from "@myapp/db"
import { Hono } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { createSession, deleteSession, hashPassword, verifyPassword } from "../lib/auth.js"
import { authMiddleware } from "../middleware/auth.js"
import {
  deleteAccountSchema,
  loginSchema,
  signupSchema,
  updateNameSchema,
  updatePasswordSchema,
} from "../schemas/auth.js"

const app = new Hono()

// Cookieの共通設定
// - httpOnly: XSSでセッションIDを盗まれないため
// - secure: HTTPSのみ送信
// - sameSite "Lax": 別サイトからのPORTからは Cookieを送らない
// - max: 7日（DB の Session.expiresAtと揃える）
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, //７日
}

const routes = app

  // 新規登録
  // - 成功時: パスワードをハッシュ化してユーザーを生成 -> セッションを発行 -> Cookieにセッションをセット -> 自動ログイン
  // - メールアドレス重複: Prisma の P2002（UNIQUE 制約違反）を捕捉して 409 を返す
  // - 想定外の DB エラー: catch せず throw → Hono のグローバルエラーハンドラに任せる
  .post("/signup", zValidator("json", signupSchema), async (c) => {
    const { email, name, password } = c.req.valid("json")

    try {
      const passwordHash = await hashPassword(password)
      const user = await prisma.user.create({
        data: { email, name, passwordHash },
      })
      const session = await createSession(user.id)
      setCookie(c, "session", session.id, COOKIE_OPTIONS)

      return c.json({ id: user.id, email: user.email, name: user.name }, 201)
    } catch (err) {
      // Prismaの「P2002」エラーはデータベースのUNIQUE制約に違反した際に発生するエラー
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return c.json({ error: "このメールアドレスは既に登録されています" }, 409)
      }
      // 想定外はHonoに任せる
      throw err
    }
  })

  // ログイン
  // -「ユーザーが存在しない」と「パスワード不一致」を同じメッセージで返す
  //   -> 攻撃者にメールアドレスの登録有無を漏らさないため
  // - 成功時: 既存セッションは削除せずに createSession で新たなセッションを生成 -> 複数端末のログイン
  // - 古いセッションは（expiresAtの TTL）で自然消滅
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json")

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return c.json({ error: "メールアドレスまたはパスワードが違います" }, 401)
    }

    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      return c.json({ error: "メールアドレスまたはパスワードが違います" }, 401)
    }

    const session = await createSession(user.id)
    setCookie(c, "session", session.id, COOKIE_OPTIONS)

    return c.json({ id: user.id, email: user.email, name: user.name }, 200)
  })

  // ログアウト
  // Cookieがなくても 200 を返す
  // deleteSessionは deleteManyを使うため、errorにならない
  // サーバー側のセッション削除とクライアント側のCookie削除を両方行う
  .post("/logout", async (c) => {
    const sessionId = getCookie(c, "session")

    if (sessionId) {
      await deleteSession(sessionId)
    }

    deleteCookie(c, "session", { path: "/" })
    return c.json({ ok: true })
  })

  // 現在のログインユーザーを返す
  // selectで　id / email / name のみを返す（passwordHashをレスポンスに返さないため）
  // - user が null になるケース: セッションは valid だがユーザーが削除された稀ケース → 401
  .get("/me", authMiddleware, async (c) => {
    const userId = c.get("userId")

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    return c.json({ id: user.id, email: user.email, name: user.name }, 200)
  })

  // ユーザー名を変更する Profileのユーザー名変更フォームから呼ばれる
  // - 認証必須
  // - レスポンスは getMe と同形式で id / email / name のみ
  .patch("/me", authMiddleware, zValidator("json", updateNameSchema), async (c) => {
    const userId = c.get("userId")
    const { name } = c.req.valid("json")

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, email: true, name: true },
    })

    return c.json(user, 200)
  })

  // パスワードを変更する Profileのパスワード変更フォームから呼ばれる
  // - 認証必須 + 現在のパスワード照合
  // - 成功時は 204 No Content
  // - 現在のパスワードが違う場合は 401
  .put("/me/password", authMiddleware, zValidator("json", updatePasswordSchema), async (c) => {
    const userId = c.get("userId")
    const { currentPassword, newPassword } = c.req.valid("json")

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return c.json({ error: "ユーザーが見つかりません" }, 401)
    }

    const ok = await verifyPassword(currentPassword, user.passwordHash)
    if (!ok) {
      return c.json({ error: "現在のパスワードが違います" }, 401)
    }

    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })

    return c.body(null, 204)
  })

  // アカウントを削除する DeleteAccountDialogから呼ばれる
  // - 認証必須 + パスワード再確認
  // - Book / Session は Prisma の onDelete: Cascade で自動削除
  // - 成功時はクライアント側のCookieも消して 204
  // - パスワードが違う場合は 401
  .delete("/me", authMiddleware, zValidator("json", deleteAccountSchema), async (c) => {
    const userId = c.get("userId")
    const { password } = c.req.valid("json")

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return c.json({ error: "ユーザーが見つかりません" }, 401)
    }

    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      return c.json({ error: "パスワードが違います" }, 401)
    }

    await prisma.user.delete({ where: { id: userId } })
    deleteCookie(c, "session", { path: "/" })

    return c.body(null, 204)
  })

export default routes
