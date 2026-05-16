import type { FormEvent } from "react"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router"
import DeleteAccountDialog from "../components/DeleteAccountDialog"
import { useAuth } from "../contexts/AuthContext"
import { updatePassword } from "../lib/auth"

// プロフィール画面
// - ユーザー名変更 / パスワード変更 / アカウント削除の3セクション
// - 未ログイン時は /login にリダイレクト
// - currentUser の更新は AuthContext 経由（updateName / deleteAccount）
// - パスワード変更は currentUser に影響しないので lib/auth を直接呼ぶ
const Profile = () => {
  const { currentUser, updateName, deleteAccount } = useAuth()
  const navigate = useNavigate()

  // ユーザー名変更フォーム
  const [name, setName] = useState(currentUser?.name ?? "")
  const [nameMessage, setNameMessage] = useState<string | null>(null)
  const [isUpdatingName, setIsUpdatingName] = useState(false)

  // パスワード変更フォーム
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // アカウント削除（ダイアログ）
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | undefined>()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!currentUser) return <Navigate to="/login" replace />

  const handleUpdateName = async (e: FormEvent) => {
    e.preventDefault()
    setNameMessage(null)
    setIsUpdatingName(true)
    try {
      await updateName({ name })
      setNameMessage("ユーザー名を変更しました")
    } catch (err) {
      setNameMessage(err instanceof Error ? err.message : "ユーザー名の変更に失敗しました")
    } finally {
      setIsUpdatingName(false)
    }
  }

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordMessage(null)
    setIsUpdatingPassword(true)
    try {
      await updatePassword({ currentPassword, newPassword, confirmNewPassword })
      setPasswordMessage("パスワードを変更しました")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "パスワードの変更に失敗しました")
    } finally {
      setIsUpdatingPassword(false)
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
      <h1 className="text-3xl font-bold text-stone-800 mb-8">プロフィール</h1>

      {/* ユーザー名変更 */}
      <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-stone-800 mb-4">ユーザー名</h2>
        <form onSubmit={handleUpdateName} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isUpdatingName}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            maxLength={50}
            required
          />
          {nameMessage && <p className="text-sm text-stone-600">{nameMessage}</p>}
          <button
            type="submit"
            disabled={isUpdatingName || name === currentUser.name || name.length === 0}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {isUpdatingName ? "保存中..." : "保存"}
          </button>
        </form>
      </section>

      {/* パスワード変更 */}
      <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-stone-800 mb-4">パスワード変更</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm text-stone-700 mb-1">
              現在のパスワード
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isUpdatingPassword}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm text-stone-700 mb-1">
              新しいパスワード（8文字以上）
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isUpdatingPassword}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              minLength={8}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-new-password" className="block text-sm text-stone-700 mb-1">
              新しいパスワード（確認）
            </label>
            <input
              id="confirm-new-password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              disabled={isUpdatingPassword}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              minLength={8}
              required
            />
          </div>
          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordMessage && <p className="text-sm text-stone-600">{passwordMessage}</p>}
          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {isUpdatingPassword ? "変更中..." : "パスワードを変更"}
          </button>
        </form>
      </section>

      {/* アカウント削除（最下部の危険操作） */}
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
