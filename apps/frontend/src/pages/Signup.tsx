import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@myapp/backend/src/schemas/auth"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import type { SignupInput } from "../lib/auth"

const SignupPage = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SignupInput) => {
    setServerError(null)
    try {
      await signup(data)
      navigate("/home")
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "新規登録に失敗しました")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-stone-200">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="w-12 h-12 text-amber-700 mr-3" />
          <h1 className="text-3xl font-bold text-stone-800">Book Trip</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
              名前
            </label>
            <input
              type="text"
              id="name"
              autoComplete="name"
              {...register("name")}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white pr-10"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
              パスワード
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                {...register("password")}
                className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              パスワード（確認）
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                aria-label={showConfirmPassword ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

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
            {isSubmitting ? "登録中..." : "新規登録"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-600">
          すでにアカウントをお持ちの方は{" "}
          <Link
            to="/login"
            className="text-amber-700 hover:text-amber-800 font-medium
  underline"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
