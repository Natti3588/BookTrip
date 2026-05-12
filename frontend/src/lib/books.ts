/**
 *  本リソース（/api/books）に対するAPIラッパー
 *
 * - 型は Hono RPC Clientから自動推論
 * - read系（getBooks / getBook）は失敗時に英文Error（dev向け、 console用）
 * - mutation系（create / update / delete）は失敗時に日本語Error（UI表示用）
 *   バックエンドが返す{ error: "日本語" }を尊重するが、なければfallbackを使う
 */

import type { InferRequestType, InferResponseType } from "hono"
import { client } from "../api/rpc"
import { extractError } from "./api-error"

// GET /api/books（一覧）のレスポンス1件分の型 所有者(userId)は含まない
export type Book = InferResponseType<typeof client.api.books.$get>[number]
// GET /api/books/:id のレスポンス型（200 のみ抽出） 所有者判定用に userId を含む
export type BookWithOwner = InferResponseType<(typeof client.api.books)[":id"]["$get"], 200>
// POST /api/books のJSONリクエストボディの型 BookAddのフォーム入力型として使う
export type createBookInput = InferRequestType<typeof client.api.books.$post>["json"]
// PUT /api/books/:id のJSONリクエストボディ型 BookEditフォームの入力型として使う
export type updateBookInput = InferRequestType<(typeof client.api.books)[":id"]["$put"]>["json"]

// 本の一覧をサーバーから取得する
// - 並び順: 更新日時の降順
// - 失敗時: HTTpステータスを含む英文errorをthrow(dev用、UI表示はしない)
export const getBooks = async (): Promise<Book[]> => {
  // GET /api/booksを呼ぶ Cookieも自動送信
  const res = await client.api.books.$get()
  // 2xx以外なら例外 呼び出し元の.catchでconsole.errorされる想定
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`)
  // 成功レスポンスをBook[]としてパース
  return res.json()
}

// 指定された id の本を意見取得する 小勇者判定のため userId を含む型を返す
// - 失敗時: ステータスを含む英文errorをthrow
export const getBook = async (id: string): Promise<BookWithOwner> => {
  // GET /api/books/:idを呼ぶ
  const res = await client.api.books[":id"].$get({ param: { id } })
  // 失敗時はステータスコード付きでthrow
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`)
  // 成功レスポンスをBookWithOwnerとしてパース
  return res.json()
}

// 本を新規登録する BookAddのフォーム送信時に呼ばれる
// - 失敗時: バックエンドの日本語エラー、またはfallbackをErrorとしてthrow
export const createBook = async (data: createBookInput): Promise<Book> => {
  // POST /api/books（jsonボディ）を呼ぶCookieで認証する
  const res = await client.api.books.$post({ json: data })
  // 失敗時は日本語メッセージでthrow
  if (!res.ok) throw new Error(await extractError(res, "本の追加に失敗しました"))
  // 作成されたBookと201のレスポンスを返す
  return res.json()
}

// 既存の本を更新する BookEditの保存時に呼ばれる
// - 戻り値がvoid: バックエンドは204 NoContextで返すため
// - 404の意味: 本がない or 他のユーザーの本（情報秘匿のために区別しない）
export const updateBook = async (id: string, data: updateBookInput): Promise<void> => {
  // PUT /api/books/:id（jsonボディ）を呼ぶ Cookieで認証する
  const res = await client.api.books[":id"].$put({ param: { id }, json: data })
  // 失敗時は日本語メッセージで throw
  if (!res.ok) throw new Error(await extractError(res, "本の更新に失敗しました"))
}

// 本を削除する　BookDetailの削除確認ダイアログ（DeleteConfirmDialog）から呼ばれる
// - 戻り値がvoid: バックエンドは204 NoContextで返すため
// - 404の意味: 本がない or 他のユーザーの本（情報秘匿のために区別しない）
export const deleteBook = async (id: string): Promise<void> => {
  // DELETE /api/books/:idを呼ぶ Cookieで認証する
  const res = await client.api.books[":id"].$delete({ param: { id } })
  // 失敗時は日本語メッセージで throw
  if (!res.ok) throw new Error(await extractError(res, "本の削除に失敗しました"))
}
