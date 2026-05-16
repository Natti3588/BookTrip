/**
 * 本リソース（/api/books）のルーティング
 *
 * - GET （一覧 / 詳細）: 未ログインでも閲覧可
 * - POST / PUT / DELETE: AuthMiddlewareでログイン必須　＋　自分の本のみ操作可
 * - 所有者チェックは where: { id: userId }で実現
 * - updateMany / deleteMany を使うのは「存在しない」と「他人の本」を　count === 0
 * 　で同じ404にまとめるため
 * - 更新・削除の成功時は 204 No Content
 */

import { zValidator } from "@hono/zod-validator"
import { prisma } from "@myapp/db"
import { Hono } from "hono"
import { authMiddleware } from "../middleware/auth.js"
import { bookIdParamSchema, createBookSchema, updateBookSchema } from "../schemas/book.js"

const app = new Hono()

// 本の一覧を返す（未ログインでも閲覧可）
// - 並び順: 更新日時の降順
// - userIdは selectに含めない（一覧では所有者情報を返さない方針）
const routes = app
  .get("/", async (c) => {
    const books = await prisma.book.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        author: true,
        genre: true,
        publishedYear: true,
        coverImage: true,
        description: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return c.json(books)
  })

  // 自分の投稿した本一覧を返す（ログイン必須）
  // - 認証ミドルウェアで設定したuserIdで絞り込み
  // - userIdは自分の本だとわかりきって言るためselectから除外
  .get("/me", authMiddleware, async (c) => {
    const userId = c.get("userId")
    const books = await prisma.book.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        author: true,
        genre: true,
        publishedYear: true,
        coverImage: true,
        description: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return c.json(books)
  })

  // 本の詳細を返す（未ログインでも閲覧可）
  // - userId を含めて返す: フロントでどのユーザーに「編集・削除ボタンを出すか」の判定に使うから
  // - 見つからない場合は 404
  .get("/:id", zValidator("param", bookIdParamSchema), async (c) => {
    const { id } = c.req.valid("param")
    const book = await prisma.book.findUnique({ where: { id } })
    if (!book) return c.json({ error: "本が見つかりません" }, 404)
    return c.json(book)
  })

  // 本を新規作成する（ログイン必須）
  // - userId は Cookie 経由で authMiddleware がセットしたものを利用
  // - 成功時は作成した本を 201 で返す
  .post("/", authMiddleware, zValidator("json", createBookSchema), async (c) => {
    const data = c.req.valid("json")
    const userId = c.get("userId")
    const book = await prisma.book.create({
      data: { ...data, userId },
    })
    return c.json(book, 201)
  })

  // 本を更新する（ログイン必須、自分の本のみ）
  // - updateMany + where: { id, userId } で「自分の本だけ」を対象に
  // - 404 の意味: 「本がない」か「他人の本」
  // - 成功時は 204 No Context
  .put(
    "/:id",
    authMiddleware,
    zValidator("param", bookIdParamSchema),
    zValidator("json", updateBookSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const data = c.req.valid("json")
      const userId = c.get("userId")
      const result = await prisma.book.updateMany({
        where: { id, userId },
        data,
      })

      if (result.count === 0) {
        return c.json({ error: "本が見つかりません" }, 404)
      }
      return c.body(null, 204)
    },
  )

  // 本を削除する（ログイン必須、自分の本のみ）
  // ^ deleteMany を使う理由は PUT と同じ
  // - 404 の意味も PUT と同じ
  // - 成功時は 204 No Context
  .delete("/:id", authMiddleware, zValidator("param", bookIdParamSchema), async (c) => {
    const { id } = c.req.valid("param")
    const userId = c.get("userId")
    const result = await prisma.book.deleteMany({ where: { id, userId } })

    if (result.count === 0) {
      return c.json({ error: "本が見つかりません" }, 404)
    }
    return c.body(null, 204)
  })

export default routes
