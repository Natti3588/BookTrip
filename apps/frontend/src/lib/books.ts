/**
 *  本リソース（/api/books）に対するAPIラッパー
 *
 * - 型は Hono RPC Clientから自動推論
 * - read系（getBooks / getBook）は失敗時に英文Error（dev向け、 console用）
 * - mutation系（create / update / delete）は失敗時に日本語Error（UI表示用）
 *   バックエンドが返す{ error: "日本語" }を尊重するが、なければfallbackを使う
 */

import { extractError } from "@myapp/utils"
import type { InferRequestType, InferResponseType } from "hono"
import { client } from "../api/rpc"

// 型を Hono RPC Client から自動推論

// 一覧用 （所有者情報はなし）
export type Book = InferResponseType<typeof client.api.books.$get>[number]
// 詳細用 （所有者情報あり）
export type BookWithOwner = InferResponseType<(typeof client.api.books)[":id"]["$get"], 200>
// 自分の本一覧用
export type MyBook = InferResponseType<typeof client.api.books.me.$get>[number]
// 新規登録のフォーム入力用
export type CreateBookInput = InferRequestType<typeof client.api.books.$post>["json"]
// 編集んおフォーム入力用
export type UpdateBookInput = InferRequestType<(typeof client.api.books)[":id"]["$put"]>["json"]

// 本の一覧をサーバーから取得する
// - 並び順: 更新日時の降順
// - 失敗時: HTTPステータスを含む英文errorをthrow(dev用、UI表示はしない)
export const getBooks = async (): Promise<Book[]> => {
  const res = await client.api.books.$get()
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`)
  return res.json()
}

// 指定された id の本を意見取得する 小勇者判定のため userId を含む型を返す
// - 失敗時: ステータスを含む英文errorをthrow
export const getBook = async (id: string): Promise<BookWithOwner> => {
  const res = await client.api.books[":id"].$get({ param: { id } })
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`)
  return res.json()
}

// 自分が登録した本を全件取得する
// - 並び順: 更新日時の降順
// - 失敗時: HTTPステータスを含む英文errorをthrow(dev用、UI表示はしない)
export const getMyBooks = async (): Promise<MyBook[]> => {
  const res = await client.api.books.me.$get()
  if (!res.ok) throw new Error(`Failed to fetch my books: ${res.status}`)
  return res.json()
}

// 本を新規登録する BookAddのフォーム送信時に呼ばれる
// - 失敗時: バックエンドの日本語エラー、またはfallbackをErrorとしてthrow
export const createBook = async (data: CreateBookInput): Promise<Book> => {
  const res = await client.api.books.$post({ json: data })
  if (!res.ok) throw new Error(await extractError(res, "本の追加に失敗しました"))
  return res.json()
}

// 既存の本を更新する BookEditの保存時に呼ばれる
// - 戻り値がvoid: バックエンドは204 NoContextで返すため
// - 404の意味: 本がない or 他のユーザーの本（情報秘匿のために区別しない）
export const updateBook = async (id: string, data: UpdateBookInput): Promise<void> => {
  const res = await client.api.books[":id"].$put({ param: { id }, json: data })
  if (!res.ok) throw new Error(await extractError(res, "本の更新に失敗しました"))
}

// 本を削除する　BookDetailの削除確認ダイアログ（DeleteConfirmDialog）から呼ばれる
// - 戻り値がvoid: バックエンドは204 NoContextで返すため
// - 404の意味: 本がない or 他のユーザーの本（情報秘匿のために区別しない）
export const deleteBook = async (id: string): Promise<void> => {
  const res = await client.api.books[":id"].$delete({ param: { id } })
  if (!res.ok) throw new Error(await extractError(res, "本の削除に失敗しました"))
}
