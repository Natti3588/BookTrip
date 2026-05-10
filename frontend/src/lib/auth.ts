import type { InferRequestType, InferResponseType } from "hono"
import { client } from "../api/rpc"

export type SignupInput = InferRequestType<typeof client.api.auth.signup.$post>["json"]
export type LoginInput = InferRequestType<typeof client.api.auth.login.$post>["json"]
export type User = InferResponseType<typeof client.api.auth.signup.$post, 201>

export const signup = async (data: SignupInput): Promise<User> => {
  // Hono RPC Clientを使って(POST /api/auth/signup)にSignupInput型のデータをリクエストボディとして送る
  const res = await client.api.auth.signup.$post({ json: data })

  // HTTPステータスコードが失敗を表したらif文へ
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error("error" in body ? body.error : "新規登録に失敗しました")
  }
  // 成功したらレスポンスをJSONで返す
  return res.json()
}

export const login = async (data: LoginInput): Promise<User> => {
  // Hono RPC Clientを使って(POST /api/auth/login)にLoginInput型のデータをリクエストボディとして送る
  const res = await client.api.auth.login.$post({ json: data })

  // HTTPステータスコードが失敗を表したらif文へ
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error("error" in body ? body.error : "ログインに失敗しました")
  }
  // 成功したらレスポンスをJSONで返す
  return res.json()
}

export const logout = async (): Promise<void> => {
  // Hono RPC Clientを使って(POST /api/auth/logoutを叩いてログアウト
  const res = await client.api.auth.logout.$post()
  if (!res.ok) {
    throw new Error("ログアウトに失敗しました")
  }
}

export const getMe = async (): Promise<User | null> => {
  const res = await client.api.auth.me.$get()
  // GET /api/meは「ログイン状態の確認」が目的なので、401エラーではなくnullを返す
  if (res.status === 401) return null
  if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました")
  return res.json()
}
