import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

type Props = {
  isOpen: boolean
  isDeleting: boolean
  errorMessage?: string | null
  onConfirm: (password: string) => void
  onCancel: () => void
}

// アカウント削除の確認ダイアログ
// - errorMessage は API 失敗時のメッセージ表示用
const DeleteAccountDialog = ({ isOpen, isDeleting, errorMessage, onConfirm, onCancel }: Props) => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  if (!isOpen) return null

  const handleCancel = () => {
    setPassword("")
    setShowPassword(false)
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-stone-800 mb-4">アカウント削除の確認</h2>
        <p className="text-stone-700 mb-4">
          アカウントを削除すると、登録した本やセッションもすべて失われます。この操作は取り消せません。
        </p>
        <label htmlFor="delete-account-password" className="block text-sm text-stone-700 mb-1">
          続行するにはパスワードを入力してください
        </label>
        <div className="relative">
          <input
            id="delete-account-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isDeleting}
            className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="パスワード"
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
        {errorMessage && <p className="text-sm text-red-600 mt-2">{errorMessage}</p>}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeleting}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded-md hover:bg-stone-300 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => onConfirm(password)}
            disabled={isDeleting || password.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "削除中..." : "アカウントを削除"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountDialog
