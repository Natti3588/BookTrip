import type { InferResponseType } from "hono"
import { client } from "../api/rpc"

export type Book = InferResponseType<typeof client.api.books.$get>[number]

export const getBooks = async (): Promise<Book[]> => {
  const res = await client.api.books.$get()
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`)
  return res.json()
}

export const getBook = async (id: string): Promise<Book> => {
  const res = await client.api.books[":id"].$get({ param: { id } })
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`)
  return res.json()
}
