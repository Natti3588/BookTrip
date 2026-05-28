import { useState } from "react"
import type { DeleteAccountInput } from "../../lib/auth"
import DeleteAccountDialog from "../DeleteAccountDialog"

type Props = {
  deleteAccount: (data: DeleteAccountInput) => Promise<void>
  onDeleted: () => void
}

const DeleteAccountSection = ({ deleteAccount, onDeleted }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (password: string) => {
    setError(null)
    setIsDeleting(true)
    try {
      await deleteAccount({ password })
      setIsOpen(false)
      onDeleted()
    } catch (err) {
      setError(err instanceof Error ? err.message : "アカウントの削除に失敗しました")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <section className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
        <h2 className="text-xl font-bold text-red-700 mb-4">アカウントの削除</h2>
        <p className="text-stone-700 mb-4 text-sm">
          アカウントを削除すると、登録した本やセッションもすべて失われます。この操作は取り消せません。
        </p>
        <button
          type="button"
          onClick={() => {
            setError(null)
            setIsOpen(true)
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          アカウントを削除する
        </button>
      </section>
      <DeleteAccountDialog
        isOpen={isOpen}
        isDeleting={isDeleting}
        errorMessage={error}
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  )
}

export default DeleteAccountSection
