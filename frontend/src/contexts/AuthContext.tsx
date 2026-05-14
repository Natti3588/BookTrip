/**
 * 認証状態をアプリ全体に渡す React Context
 * - currentuser: 現在のログインユーザー（未ログインは null）
 * - isLoading: 初回マウント時の getMeが終わるまで true
 *  -> 認証チェックが完了前にログイン画面を出さないため
 * - signup / login / logout: APIを叩いて currentUserにセットする
 * 
 * useAuth は AuthProvider 配下のコンポーネントからのみ呼べる
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  getMe,
  type LoginInput,
  login as loginApi,
  logout as logoutApi,
  type SignupInput,
  signup as signupApi,
  type User,
} from "../lib/auth"

// Contextが公開する useAuthの戻り値型として使う
type AuthContextValue = {
  currentUser: User | null
  isLoading: boolean
  signup: (data: SignupInput) => Promise<void>
  login: (data: LoginInput) => Promise<void>
  logout: () => Promise<void>
}

// Contextの初期値が undefined なのは Providerの外でuseAuth が呼ばれたケースを検知するため
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// アプリ全体を囲む AuthProvider 配下で useAuthが使える
// - 起動時: getMe で Cookie由来のログイン状態を復元
// - signup / login: 成功時に currentUserを更新
// - logout: サーバー結果にかかわらずクライアント側の状態を破棄 
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  // 小コンポーネントで「認証チェック完了化」を判断するためのstate
  const [isLoading, setIsLoading] = useState(true)

  // 初回マウント時に1回だけ実行
  // - getMe は401をnullで返す
  // - その他の失敗は console.errorでログに残しつつ未ログイン扱いに
  // - 成否にかかわらず最後に isLoading をfalseにして UIのローディング表示を解除
  useEffect(() => {
    getMe()
      .then((data) => setCurrentUser(data))
      .catch((err) => {
        // ネットワーク障害やサーバー異常時は「未ログイン扱い」
        console.error(`Failed to fetch current user:`, err)
        setCurrentUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // 新規登録 SignupFormの送信時に呼ばれる
  // - 失敗時は signApiが throw するのでキャッチしない（UI表示させるため）
  // - useCallback で参照を安定化 valueのuseMemoの依存に入るため
  const signup = useCallback(async (data: SignupInput) => {
    const user = await signupApi(data)
    setCurrentUser(user)
  }, [])

  // ログイン LoginFormの送信時に呼ばれる
  // - 失敗時は loginApiが throw するのでキャッチしない（UI表示させるため）
  // - useCallback で参照を安定化（理由は signup と同じ）
  const login = useCallback(async (data: LoginInput) => {
    const user = await loginApi(data)
    setCurrentUser(user)
  }, [])

  // ログアウト　Headerのログアウトボタンから呼ばれる
  // - サーバー側のログアウトに失敗しても、クライアント側の状態は破棄して強制ログアウト
  //   理由: 「ログアウトしたいのにできない」を避けるため
  const logout = useCallback(async () => {
    await logoutApi()
    setCurrentUser(null)
  }, [])

  // Provider に渡す value を useMemo で参照安定化
  const value = useMemo(
    () => ({ currentUser, isLoading, signup, login, logout }),
    [currentUser, isLoading, signup, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 認証Context を読むカスタムフック
// - AuthProvider意外で使うとthrow
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthはAuthProvider内で使用する必要があります")
  return ctx
}
