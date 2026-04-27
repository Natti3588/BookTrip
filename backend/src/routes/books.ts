import { Hono } from "hono"
import { prisma } from "../lib/prisma.js"

const app = new Hono()

app.get("/", async (c) => {
  const items = await prisma.book.findMany({ orderBy: { createdAt: "desc" } })
  return c.json(items)
})

app.get("/:id", async (c) => {
  const id = c.req.param("id")
  const book = await prisma.book.findUnique({ where: { id } })
  if (!book) return c.json({ error: "Not Found" }, 404)
  return c.json(book)
})

export default app
