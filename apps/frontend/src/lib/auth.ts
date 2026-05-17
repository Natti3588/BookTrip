/**
 * 認証リソースに（/api/auth）に対するAPIラッパー
 *
 * - 型は Hono RPC Client から自動推論
 * - 失敗時はすべて日本語の error を throw（UI表示のため）
 *   バックエンドが返す日本語のエラーを尊重するが、なければfallbackを使う
 * - getMeのみ例外的に「未ログイン状態をnull」で表現（ログイン状態を確認する目的のため）
 */

import { extractError } from "@myapp/utils"
import type { InferRequestType, InferResponseType } from "hono"
import { client } from "../api/rpc"

// 型を Hono RPC Client から自動推論

// API ラッパーの返り値用
export type User = InferResponseType<typeof client.api.auth.signup.$post, 201>
// ユーザー登録用
export type SignupInput = InferRequestType<typeof client.api.auth.signup.$post>["json"]
// ユーザーログイン用
export type LoginInput = InferRequestType<typeof client.api.auth.login.$post>["json"]
// ユーザー名更新用
export type UpdateNameInput = InferRequestType<typeof client.api.auth.me.$patch>["json"]
// ユーザーパスワード更新用
export type UpdatePasswordInput = InferRequestType<typeof client.api.auth.me.password.$put>["json"]
// ユーザーアカウント削除用
export type DeleteAccountInput = InferRequestType<typeof client.api.auth.me.$delete>["json"]

// 新規登録する　Signupの送信時に呼ばれる
// - 成功時: Set-Cookieでセッションが自動付与される
// - 失敗時: バックエンドの日本語エラー、または fallback を throw
export const signup = async (data: SignupInput): Promise<User> => {
  const res = await client.api.auth.signup.$post({ json: data })

  if (!res.ok) throw new Error(await extractError(res, "新規登録に失敗しました"))
  return res.json()
}

// ログインする LoginForm の送信時に呼ばれる
// - 成功時: Set-Cookieでセッションが自動付与
// - 失敗時: バックエンドの日本語エラー、または fallback をthrow
export const login = async (data: LoginInput): Promise<User> => {
  const res = await client.api.auth.login.$post({ json: data })

  if (!res.ok) throw new Error(await extractError(res, "ログインに失敗しました"))
  return res.json()
}

// ログアウトする　Headerのログアウトボタンから呼ばれる
// - 成功時: バックエンドがセッションCookie を削除
// - 失敗時: バックエンドのの日本後エラー、またはfallback を throw
export const logout = async (): Promise<void> => {
  const res = await client.api.auth.logout.$post()

  if (!res.ok) {
    throw new Error("ログアウトに失敗しました")
  }
}

// 現在のログインユーザーを取得する　AuthContext の初期化と再検証で呼ばれる
// - 401 -> null: 未ログインを Error ではなく nullで表現（呼び出し元でNullを使うため）
// - 401以外の失敗 -> throw: ネットワーク障害などは Error
export const getMe = async (): Promise<User | null> => {
  const res = await client.api.auth.me.$get()
  const status: number = res.status
  if (status === 401) return null
  if (!res.ok) throw new Error(`ユーザー情報の取得に失敗しました（HTTP ${status}）`)
  return res.json()
}

// ユーザー名を変更する Profile の名前変更フォームから呼ばれる
// - 成功時: 更新後の id / email / name を返す
// - 失敗時: バックエンドの日本語エラー、または fallback を throw
export const updateName = async (data: UpdateNameInput): Promise<User> => {
  const res = await client.api.auth.me.$patch({ json: data })
  if (!res.ok) throw new Error(await extractError(res, "ユーザー名の変更に失敗しました"))
  return res.json()
}

// パスワードを変更する Profile のパスワード変更フォームから呼ばれる
// - 成功時: 204 No Content（戻り値は void）
// - 失敗時: バックエンドの日本語エラー、または fallback を throw
export const updatePassword = async (data: UpdatePasswordInput): Promise<void> => {
  const res = await client.api.auth.me.password.$put({ json: data })
  if (!res.ok) throw new Error(await extractError(res, "パスワードの変更に失敗しました"))
}

// アカウントを削除する DeleteAccountDialog から呼ばれる
// - 成功時: 204 No Content（戻り値は void） サーバー側で Cookie も消える
// - 失敗時: バックエンドの日本語エラー、または fallback を throw
export const deleteAccount = async (data: DeleteAccountInput): Promise<void> => {
  const res = await client.api.auth.me.$delete({ json: data })
  if (!res.ok) throw new Error(await extractError(res, "アカウントの削除に失敗しました"))
}
