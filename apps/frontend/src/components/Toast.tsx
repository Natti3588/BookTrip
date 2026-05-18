import { CheckCircle2, X } from "lucide-react"
import { useEffect } from "react"

type Props = {
  message: string
  onClose: () => void
}

const Toast = ({ message, onClose }: Props) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-lg"
    >
      <CheckCircle2 className="w-5 h-5 shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="閉じる"
        className="text-stone-500 hover:text-stone-700 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
