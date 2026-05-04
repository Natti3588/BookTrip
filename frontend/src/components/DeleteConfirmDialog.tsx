type Props = {
  isOpen: boolean
  itemName: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmDialog = ({ isOpen, itemName, isDeleting, onConfirm, onCancel }: Props) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-stone-800 mb-4">削除の確認</h2>
        <p className="text-stone-700 mb-6">
          「{itemName}」を削除しますか？この操作は取り消せません。
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded-md hover:bg-stone-300 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {isDeleting ? "削除中..." : "削除"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmDialog
