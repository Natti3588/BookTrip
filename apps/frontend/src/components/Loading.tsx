type Props = {
  size?: "sm" | "md" | "lg"
}

const Loading = ({ size = "md" }: Props) => {
  // サイズごとのクラス定義
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-50 w-full gap-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-gray-200 border-t-amber-500`}
        role="status"
        aria-label="読み込み中"
      />
      <span className="text-sm font-medium text-gray-500 animate-pulse">読み込み中...</span>
    </div>
  )
}

export default Loading
