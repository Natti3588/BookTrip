import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Calendar, Edit2, Star, Tag, Trash2, User } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import DeleteConfirmDialog from "../components/DeleteConfirmDialog"
import NotFoundView from "../components/NotFoundView"
import Rating from "../components/Rating"
import { useAuth } from "../contexts/AuthContext"
import { deleteBook, getBook } from "../lib/books"

const FALLBACK_IMAGE = "https://placehold.co/300x450?text=No+Image"

const BookDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books", id],
    queryFn: () => {
      if (!id) throw new Error("IDは必要です") // TypeScriptの型ナローイングのために throw
      return getBook(id)
    },
    enabled: !!id,
  })

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)

    try {
      await deleteBook(id)
      queryClient.invalidateQueries({ queryKey: ["books"] })
      navigate("/books?deleted=true")
    } catch (err) {
      console.error("本の削除に失敗しました", err)
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) return <p className="text-center py-12 text-stone-600">読み込み中...</p>
  if (isError || !book) {
    console.error(error)
    return <NotFoundView />
  }

  const isUpdated = book.updatedAt !== book.createdAt
  const dateLabel = isUpdated ? "最終更新日" : "登録日"
  const dateValue = isUpdated ? book.updatedAt : book.createdAt

  const isOwner = !!currentUser && !!book && currentUser.id === book.userId

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/books"
        className="inline-flex items-center text-stone-700 hover:text-stone-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        一覧に戻る
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
          <h1 className="font-serif font-bold text-2xl text-stone-800">本の詳細</h1>
          {isOwner && (
            <div className="flex space-x-2">
              <Link
                to={`/books/${book.id}/edit`}
                className="flex items-center space-x-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>編集</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>削除</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-8">
          <div className="shrink-0">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full md:w-64 h-auto rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE
              }}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4">{book.title}</h2>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-stone-800">
                <User className="w-5 h-5 mr-2 text-stone-600" />
                <span className="font-medium mr-2">著者:</span>
                <span>{book.author}</span>
              </div>

              <div className="flex items-center text-stone-800">
                <Calendar className="w-5 h-5 mr-2 text-stone-600" />
                <span className="font-medium mr-2">出版年:</span>
                <span>{book.publishedYear}年</span>
              </div>

              <div className="flex items-center text-stone-800">
                <Tag className="w-5 h-5 mr-2 text-stone-600" />
                <span className="font-medium mr-2">ジャンル:</span>
                <span className="inline-block px-3 py-1 bg-amber-100 text-stone-800 rounded">
                  {book.genre}
                </span>
              </div>

              {book.rating && (
                <div className="flex items-center text-stone-800">
                  <Star className="w-5 h-5 mr-2 text-stone-600" />
                  <span className="font-medium mr-2">評価:</span>
                  <Rating value={book.rating} />
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold text-stone-800 mb-2">説明</h3>
              <p className="text-stone-800 leading-relaxed whitespace-pre-wrap">
                {book.description}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-200">
              <p className="text-sm text-stone-600">
                {dateLabel}: {new Date(dateValue).toLocaleDateString("ja-JP")}
              </p>
              <p className="text-sm text-stone-600">投稿者: {book.user.name}</p>
            </div>
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteConfirmDialog
          isOpen={showDeleteDialog}
          itemName={book.title}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  )
}

export default BookDetail
