import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { prisma } from "../lib/prisma.js"
import { authMiddleware } from "../middleware/auth.js"
import { bookIdParamSchema, createBookSchema, updateBookSchema } from "../schemas/book.js"

const app = new Hono()

const routes = app
  .get("/", async (c) => {
    // BookテーブルにあるuserIdカラムを除くすべてのレコードを更新日時で取得
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
    // 取得したデータをJSONで返す
    return c.json(books)
  })

  .get("/:id", zValidator("param", bookIdParamSchema), async (c) => {
    // バリデーション済みのURLパラメータを取得
    const { id } = c.req.valid("param")
    // 取得したidを使ってbookを取得
    const book = await prisma.book.findUnique({ where: { id } })
    // bookにnullが帰ったらJSONでerrorを返す
    if (!book) return c.json({ error: "本が見つかりません" }, 404)
    // bookの取得に成功したらbookをJSONで返す
    return c.json(book)
  })

  .post("/", authMiddleware, zValidator("json", createBookSchema), async (c) => {
    // バリデーション済みの本作成データを取得
    const data = c.req.valid("json")
    // コンテキストからuserIdを取得
    const userId = c.get("userId")
    // 取得したdata, userIdを使って本を追加
    const book = await prisma.book.create({
      data: { ...data, userId },
    })
    // 追加に成功したら作成したbookをJSONで返す
    return c.json(book, 201)
  })

  .put(
    "/:id",
    authMiddleware,
    zValidator("param", bookIdParamSchema),
    zValidator("json", updateBookSchema),
    async (c) => {
      // バリデーション済みのid, dataを取得
      const { id } = c.req.valid("param")
      const data = c.req.valid("json")
      // コンテキストからuserIdを取得
      const userId = c.get("userId")
      // idとuserIdがそれぞれ一致したら更新
      const result = await prisma.book.updateMany({
        where: { id, userId },
        data,
      })

      // 更新件数がゼロの場合Errorを返す
      if (result.count === 0) {
        return c.json({ error: "本が見つかりません" }, 404)
      }
      // 成功したらnullで204を返す
      return c.body(null, 204)
    },
  )

  .delete("/:id", authMiddleware, zValidator("param", bookIdParamSchema), async (c) => {
    // バリデーション済みのURLパラメータを取得
    const { id } = c.req.valid("param")
    // コンテキストからuserIdを取得
    const userId = c.get("userId")
    // id, userIdが一致したら削除
    const result = await prisma.book.deleteMany({ where: { id, userId } })

    // 削除件数が0の場合errorを返す
    if (result.count === 0) {
      return c.json({ error: "本が見つかりません" }, 404)
    }
    // 成功したらnullで204を返す
    return c.body(null, 204)
  })

export default routes
