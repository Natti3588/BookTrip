import type { InferRequestType, InferResponseType } from "hono"
import { client } from "../api/rpc"

export type Book = InferResponseType<typeof client.api.books.$get>[number]
export type createBookInput = InferRequestType<typeof client.api.books.$post>["json"]

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

export const createBook = async (data: createBookInput) => {
  const res = await client.api.books.$post({ json: data })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error("error" in body ? body.error : "本の追加に失敗しました")
  }
  return res.json()
}
