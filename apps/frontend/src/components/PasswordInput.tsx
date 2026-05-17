import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

type Props = {
  id: string
  label: string
  autoComplete?: "current-password" | "new-password"
  disabled?: boolean
  error?: string
  registration: UseFormRegisterReturn
}

// react-hook-form と統合したパスワード入力フィールド
// - registration には useForm の register("field") の戻り値を渡す
// - show / hide の状態はコンポーネント内部で持つ（呼び出し側は意識しない）
// - error には react-hook-form の errors[field]?.message を渡す想定
const PasswordInput = ({ id, label, autoComplete, disabled, error, registration }: Props) => {
  const [show, setShow] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          disabled={disabled}
          {...registration}
          className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
          aria-label={show ? "パスワードを隠す" : "パスワードを表示"}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default PasswordInput
