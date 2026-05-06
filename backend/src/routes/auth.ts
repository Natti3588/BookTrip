import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { Prisma } from "../generated/prisma/client.js"
import { createSession, deleteSession, hashPassword, verifyPassword } from "../lib/auth.js"
import { prisma } from "../lib/prisma.js"
import { authMiddleware } from "../middleware/auth.js"
import { loginSchema, signupSchema } from "../schemas/auth.js"

const app = new Hono()

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, //７日
}

const routes = app
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

  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json")

    // userをemailで取得
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

  .post("/logout", async (c) => {
    // 名前がsessionのCookieを取得
    const sessionId = getCookie(c, "session")

    if (sessionId) {
      await deleteSession(sessionId)
    }

    deleteCookie(c, "session", { path: "/" })
    return c.json({ ok: true })
  })

  .get("/me", authMiddleware, async (c) => {
    const userId = c.get("userId")

    // Userテーブルからid, email, nameカラムのみを取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    })

    // ユーザーを取得できなかった場合、401エラーを返す
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401)
    }

    return c.json({ id: user.id, email: user.email, name: user.name }, 200)
  })

export default routes
