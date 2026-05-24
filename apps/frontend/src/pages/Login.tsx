import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@myapp/backend/src/schemas/auth"
import { BookOpen } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import PasswordInput from "../components/PasswordInput"
import { useAuth } from "../contexts/AuthContext"
import type { LoginInput } from "../lib/auth"

// ログイン画面
// - メール / パスワードを入力
// - react-hook-form + zodResolver でバリデーション（バックエンドの loginSchema を直接 import）
// - 成功時: AuthContext.login で currentUser を更新し /home に遷移
// - 失敗時: serverError にメッセージを set してフォーム下に表示
// - 「ゲストはこちら」で未ログインのまま /home に進める
const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // フォーム送信時の処理
  // - 成功時: /home に遷移
  // - 失敗時: serverError にメッセージを set（バックエンドの日本語エラー、または fallback）
  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    try {
      await login(data)
      navigate("/home")
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "ログインに失敗しました")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-stone-200">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="w-12 h-12 text-amber-700 mr-3" />
          <h1 className="font-display font-bold text-3xl text-stone-800">Book Trip</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <PasswordInput
            id="password"
            label="パスワード"
            autoComplete="current-password"
            error={errors.password?.message}
            registration={register("password")}
          />

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          アカウントをお持ちでない方は{" "}
          <Link to="/signup" className="text-amber-700 hover:text-amber-800 font-medium underline">
            新規登録
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link
            to="/home"
            className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
          >
            <span>ゲストはこちら</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
