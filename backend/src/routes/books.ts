import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { prisma } from "../lib/prisma.js"
import { createBookSchema } from "../schemas/book.js"

const app = new Hono()

const routes = app
  .get("/", async (c) => {
    const items = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
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
    return c.json(items)
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id")
    const book = await prisma.book.findUnique({ where: { id } })
    if (!book) return c.json({ error: "Not Found" }, 404)
    return c.json(book)
  })

  .post("/", zValidator("json", createBookSchema), async (c) => {
    const data = c.req.valid("json")

    const demoUser = await prisma.user.findUnique({ where: { email: "demo@example.com" } })

    if (!demoUser) return c.json({ error: "Demo user not found" }, 500)

    const book = await prisma.book.create({
      data: { ...data, userId: demoUser.id },
    })
    return c.json(book, 201)
  })

export default routes
