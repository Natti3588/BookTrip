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

type AuthContextValue = {
  currentUser: User | null
  isLoading: boolean
  signup: (data: SignupInput) => Promise<void>
  login: (data: LoginInput) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // クライアントのCookieが有効ならUserオブジェクトを返す
    // getMeはHTTP STATUS401をnullで返す
    getMe()
      .then((data) => setCurrentUser(data))
      .catch((err) => {
        // ネットワーク障害やサーバー異常時は「未ログイン扱い」
        console.error(`Failed to fetch current user:`, err)
        setCurrentUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const signup = useCallback(async (data: SignupInput) => {
    const user = await signupApi(data)
    setCurrentUser(user)
  }, [])

  const login = useCallback(async (data: LoginInput) => {
    const user = await loginApi(data)
    setCurrentUser(user)
  }, [])

  const logout = useCallback(async () => {
    await logoutApi()
    // サーバー側のログアウトに失敗しても、クライアント側の状態は破棄して強制ログアウトさせる
    setCurrentUser(null)
  }, [])

  const value = useMemo(
    () => ({ currentUser, isLoading, signup, login, logout }),
    [currentUser, isLoading, signup, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthはAuthProvider内で使用する必要があります")
  return ctx
}
