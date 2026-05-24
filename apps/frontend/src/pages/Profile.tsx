import { zodResolver } from "@hookform/resolvers/zod"
import { updateNameSchema, updatePasswordSchema } from "@myapp/backend/src/schemas/auth"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Navigate, useNavigate } from "react-router"
import DeleteAccountDialog from "../components/DeleteAccountDialog"
import PasswordInput from "../components/PasswordInput"
import { useAuth } from "../contexts/AuthContext"
import { type UpdateNameInput, type UpdatePasswordInput, updatePassword } from "../lib/auth"

// プロフィール画面
// - ユーザー名変更 / パスワード変更 / アカウント削除の3セクション
// - 未ログイン時は /login にリダイレクト
// - 各フォームは react-hook-form + zodResolver でバリデーション
//   バックエンドの schemas/auth から Zod スキーマを直接 import して同期
// - currentUser を更新する操作は AuthContext 経由（updateName / deleteAccount）
// - パスワード変更は currentUser に影響しないので lib/auth を直接呼ぶ
const Profile = () => {
  const { currentUser, updateName, deleteAccount } = useAuth()
  const navigate = useNavigate()

  // ユーザー名フォーム
  const nameForm = useForm<UpdateNameInput>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: currentUser?.name ?? "" },
  })
  const [nameSuccess, setNameSuccess] = useState<string | null>(null)
  const [nameServerError, setNameServerError] = useState<string | null>(null)

  // パスワードフォーム
  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordServerError, setPasswordServerError] = useState<string | null>(null)

  // アカウント削除（ダイアログ）
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | undefined>()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!currentUser) return <Navigate to="/login" replace />

  const onSubmitName = async (data: UpdateNameInput) => {
    setNameSuccess(null)
    setNameServerError(null)
    try {
      await updateName(data)
      // reset で defaultValues を新しい name に上書きし、isDirty を再び false に戻す
      nameForm.reset({ name: data.name })
      setNameSuccess("ユーザー名を変更しました")
    } catch (err) {
      setNameServerError(err instanceof Error ? err.message : "ユーザー名の変更に失敗しました")
    }
  }

  const onSubmitPassword = async (data: UpdatePasswordInput) => {
    setPasswordSuccess(null)
    setPasswordServerError(null)
    try {
      await updatePassword(data)
      passwordForm.reset()
      setPasswordSuccess("パスワードを変更しました")
    } catch (err) {
      setPasswordServerError(err instanceof Error ? err.message : "パスワードの変更に失敗しました")
    }
  }

  const handleDelete = async (password: string) => {
    setDeleteError(undefined)
    setIsDeleting(true)
    try {
      await deleteAccount({ password })
      setIsDialogOpen(false)
      navigate("/", { replace: true })
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "アカウントの削除に失敗しました")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif font-bold text-3xl text-stone-800 mb-8">プロフィール</h1>

      {/* ユーザー名変更 */}
      <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <label htmlFor="name">
          <h2 className="text-xl font-bold text-stone-800 mb-4">ユーザー名</h2>
        </label>
        <form onSubmit={nameForm.handleSubmit(onSubmitName)} className="space-y-4" noValidate>
          <div>
            <input
              id="name"
              type="text"
              autoComplete="name"
              {...nameForm.register("name")}
              disabled={nameForm.formState.isSubmitting}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {nameForm.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{nameForm.formState.errors.name.message}</p>
            )}
          </div>
          {nameServerError && <p className="text-sm text-red-600">{nameServerError}</p>}
          {nameSuccess && <p className="text-sm text-green-700">{nameSuccess}</p>}
          <button
            type="submit"
            disabled={!nameForm.formState.isDirty || nameForm.formState.isSubmitting}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {nameForm.formState.isSubmitting ? "保存中..." : "保存"}
          </button>
        </form>
      </section>

      {/* パスワード変更 */}
      <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-stone-800 mb-4">パスワード変更</h2>
        <form
          onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
          className="space-y-4"
          noValidate
        >
          {/* 現在のパスワード */}
          <PasswordInput
            id="current-password"
            label="現在のパスワード"
            autoComplete="current-password"
            disabled={passwordForm.formState.isSubmitting}
            error={passwordForm.formState.errors.currentPassword?.message}
            registration={passwordForm.register("currentPassword")}
          />

          {/* 新しいパスワード */}
          <PasswordInput
            id="new-password"
            label="新しいパスワード（8文字以上）"
            autoComplete="new-password"
            disabled={passwordForm.formState.isSubmitting}
            error={passwordForm.formState.errors.newPassword?.message}
            registration={passwordForm.register("newPassword")}
          />

          {/* 新しいパスワード（確認） */}
          <PasswordInput
            id="confirm-new-password"
            label="新しいパスワード（確認）"
            autoComplete="new-password"
            disabled={passwordForm.formState.isSubmitting}
            error={passwordForm.formState.errors.confirmNewPassword?.message}
            registration={passwordForm.register("confirmNewPassword")}
          />

          {passwordServerError && <p className="text-sm text-red-600">{passwordServerError}</p>}
          {passwordSuccess && <p className="text-sm text-green-700">{passwordSuccess}</p>}
          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {passwordForm.formState.isSubmitting ? "変更中..." : "パスワードを変更"}
          </button>
        </form>
      </section>

      {/* アカウント削除 */}
      <section className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
        <h2 className="text-xl font-bold text-red-700 mb-4">アカウントの削除</h2>
        <p className="text-stone-700 mb-4 text-sm">
          アカウントを削除すると、登録した本やセッションもすべて失われます。この操作は取り消せません。
        </p>
        <button
          type="button"
          onClick={() => {
            setDeleteError(undefined)
            setIsDialogOpen(true)
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          アカウントを削除する
        </button>
      </section>

      <DeleteAccountDialog
        isOpen={isDialogOpen}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div>
  )
}

export default Profile
