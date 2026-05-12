/**
 * 認証リソースに（/api/auth）に対するAPIラッパー
 * 
 * - 型は Hono RPC Client から自動推論
 * - 失敗時はすべて日本語の error を throw（UI表示のため）
 *   バックエンドが返す { error: "日本語" }を尊重するが、なければfallbackを使う
 * - getMeのみ例外的に「未ログイン状態をnull」で表現（ログイン状態を確認する目的のため）
 */

import type { InferRequestType, InferResponseType } from "hono"
import { client } from "../api/rpc"

// POST /api/auth/signup のリクエストボディ型 Signup の入力型として使う
export type SignupInput = InferRequestType<typeof client.api.auth.signup.$post>["json"]
// POST /api/auth/login のリクエストボディ型 login の入力型として使う
export type LoginInput = InferRequestType<typeof client.api.auth.login.$post>["json"]
// POST /api/auth/signup の成功時（201）のレスポンス型 AuthContextで currentUserとして保持
export type User = InferResponseType<typeof client.api.auth.signup.$post, 201>

// 新規登録する　Signupの送信時に呼ばれる
// - 成功時: Set-Cookieでセッションが自動付与される
// - 失敗時: バックエンドの日本語エラー、または fallback を throw
export const signup = async (data: SignupInput): Promise<User> => {
  // POST /api/auth/signup（jsonボディ）を呼ぶ Cookieは自動で保存
  const res = await client.api.auth.signup.$post({ json: data })

  // 失敗時は日本語メッセージでthrow
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error("error" in body ? body.error : "新規登録に失敗しました")
  }
  // 成功したらレスポンスをUserとしてパース
  return res.json()
}

// ログインする LoginForm の送信時に呼ばれる
// - 成功時: Set-Cookieでセッションが自動付与
// - 失敗時: バックエンドの日本語エラー、または fallback をthrow 
export const login = async (data: LoginInput): Promise<User> => {
  // POST /api/auth/login（jsonボディ）を呼ぶ
  const res = await client.api.auth.login.$post({ json: data })

  // 失敗時は日本語メッセージでthrow
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error("error" in body ? body.error : "ログインに失敗しました")
  }
  // 成功したらレスポンスを User としてパース
  return res.json()
}

// ログアウトする　Headerのログアウトボタンから呼ばれる
// - 成功時: バックエンドがセッションCookie を削除
// - 失敗時: バックエンドのの本後エラー、またはfallback を throw
export const logout = async (): Promise<void> => {
  // POST /api/auth/login を呼ぶ
  const res = await client.api.auth.logout.$post()

  // 失敗時は日本語メッセージでthrow
  if (!res.ok) {
    throw new Error("ログアウトに失敗しました")
  }
}

// 現在のログインユーザーを取得する　AuthContext の初期化と再検証で呼ばれる
// - 401 -> null: 未ログインを Error ではなく nullで表現（呼び出し元でNullを使うため）
// - 401以外の失敗 -> throw: ネットワーク障害などは Error
export const getMe = async (): Promise<User | null> => {
  // GET /api/auth/me を呼ぶ
  const res = await client.api.auth.me.$get()
  // HTTP ステータスを number形で定義
  const status: number = res.status
  // 401 はエラー扱いしない（このメソッドは「ログイン状態の確認」が目的だから）
  if (status === 401) return null
  // それ以外の失敗は 日本語メッセージと HTTP ステータスで throw
  if (!res.ok) throw new Error(`ユーザー情報の取得に失敗しました（HTTP ${status}）`)
  // 成功したらレスポンスを User としてパース
  return res.json()
}
