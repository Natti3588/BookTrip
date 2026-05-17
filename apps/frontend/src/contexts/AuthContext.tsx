/**
 * 認証状態をアプリ全体に渡す React Context
 * - currentUser: 現在のログインユーザー（未ログインは null）
 * - signup / login / logout: APIを叩いて currentUserにセットする
 *
 * useAuth は AuthProvider 配下のコンポーネントからのみ呼べる
 */

import { createContext, useContext, useEffect, useState } from "react"
import {
  type DeleteAccountInput,
  deleteAccount as deleteAccountApi,
  getMe,
  type LoginInput,
  login as loginApi,
  logout as logoutApi,
  type SignupInput,
  signup as signupApi,
  type UpdateNameInput,
  type User,
  updateName as updateNameApi,
} from "../lib/auth"

// Contextが公開する useAuthの戻り値型として使う
type AuthContextValue = {
  currentUser: User | null
  signup: (data: SignupInput) => Promise<void>
  login: (data: LoginInput) => Promise<void>
  logout: () => Promise<void>
  updateName: (data: UpdateNameInput) => Promise<void>
  deleteAccount: (data: DeleteAccountInput) => Promise<void>
}

// Contextの初期値が undefined なのは Provider の外で useAuth が呼ばれたケースを検知するため
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// アプリ全体を囲む AuthProvider 配下で useAuth が使える
// - 起動時: getMe で Cookie由来のログイン状態を復元
// - signup / login: 成功時に currentUser を更新
// - logout: サーバー結果にかかわらずクライアント側の状態を破棄
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // 初回マウント時に1回だけ実行
  // - getMe は401を null で返す
  // - その他の失敗は console.error でログに残しつつ未ログイン扱いに
  useEffect(() => {
    getMe()
      .then((data) => setCurrentUser(data))
      .catch((err) => {
        // ネットワーク障害やサーバー異常時は「未ログイン扱い」
        console.error(`Failed to fetch current user:`, err)
        setCurrentUser(null)
      })
  }, [])

  // 新規登録 Signup フォームから呼ばれる
  // - 失敗時は signupApi が throw するのでキャッチしない（UI 表示させるため）
  const signup = async (data: SignupInput) => {
    const user = await signupApi(data)
    setCurrentUser(user)
  }

  // ログイン Login フォームから呼ばれる
  // - 失敗時は loginApi が throw するのでキャッチしない（UI 表示させるため）
  const login = async (data: LoginInput) => {
    const user = await loginApi(data)
    setCurrentUser(user)
  }

  // ログアウト Header のログアウトボタンから呼ばれる
  // - サーバー側のログアウトに失敗しても、クライアント側の状態は破棄して強制ログアウト
  //   理由: 「ログアウトしたいのにできない」を避けるため
  const logout = async () => {
    await logoutApi()
    setCurrentUser(null)
  }

  // ユーザー名を変更する Profile のユーザー名変更フォームから呼ばれる
  // - 成功時: 更新後の currentUser を反映
  // - 失敗時は updateNameApi が throw するのでキャッチしない（UI 表示させるため）
  const updateName = async (data: UpdateNameInput) => {
    const user = await updateNameApi(data)
    setCurrentUser(user)
  }

  // アカウントを削除する DeleteAccountDialog から呼ばれる
  // - 成功時: サーバー側で Cookie も消えるのでクライアント側も currentUser を null に
  // - 失敗時は deleteAccountApi が throw するのでキャッチしない（UI 表示させるため）
  const deleteAccount = async (data: DeleteAccountInput) => {
    await deleteAccountApi(data)
    setCurrentUser(null)
  }

  const value = { currentUser, signup, login, logout, updateName, deleteAccount }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 認証Context を読むカスタムフック
// - AuthProvider以外で使うと throw
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthはAuthProvider内で使用する必要があります")
  return ctx
}
