import { zodResolver } from "@hookform/resolvers/zod"
import { GENRES, updateBookSchema } from "@myapp/backend/src/schemas/book"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router"
import NotFoundView from "../components/NotFoundView"
import { getBook, type UpdateBookInput, updateBook } from "../lib/books"

const FALLBACK_IMAGE = "https://placehold.co/300x450?text=No+Image"

const BookEdit = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [serverError, setServerError] = useState<string | null>(null)

  // useFormでフォームを定義
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateBookInput>({
    resolver: zodResolver(updateBookSchema),
  })

  // useQuery でデータ(book)を取得
  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books", id],
    queryFn: () => {
      if (!id) throw new Error("IDは必要です") // TypeScriptの型ナローイングのために throw
      return getBook(id)
    },
    enabled: !!id,
  })

  // bookが取れたら Formを初期化
  useEffect(() => {
    if (!book) return
    reset({
      title: book.title,
      author: book.author,
      genre: book.genre as UpdateBookInput["genre"],
      publishedYear: book.publishedYear,
      coverImage: book.coverImage,
      description: book.description,
      rating: book.rating ?? undefined,
    })
  }, [book, reset])

  const onSubmit = async (data: UpdateBookInput) => {
    if (!id) return
    setServerError(null)
    try {
      await updateBook(id, data)
      queryClient.invalidateQueries({ queryKey: ["books"] })
      navigate(`/books/${id}`)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "更新に失敗しました")
    }
  }

  const coverImage = watch("coverImage")

  if (isLoading) return <p className="text-center py-12 text-stone-600">読み込み中...</p>
  if (isError || !book) return <NotFoundView />

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to={`/books/${id}`}
        className="inline-flex items-center text-stone-700 hover:text-stone-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        詳細に戻る
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-6">本を編集</h1>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              {...register("title")}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-stone-700 mb-1">
              著者 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              {...register("author")}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>}
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-stone-700 mb-1">
              ジャンル <span className="text-red-500">*</span>
            </label>
            <select
              id="genre"
              {...register("genre")}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">選択してください</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>}
          </div>

          <div>
            <label
              htmlFor="publishedYear"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              出版年 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="publishedYear"
              {...register("publishedYear", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.publishedYear && (
              <p className="mt-1 text-sm text-red-600">{errors.publishedYear.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-stone-700 mb-1">
              表紙画像URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="coverImage"
              placeholder="https://example.com/book-cover.jpg"
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              {...register("coverImage")}
            />
            {errors.coverImage && (
              <p className="mt-1 text-sm text-red-600">{errors.coverImage.message}</p>
            )}
            {coverImage && (
              <div className="mt-2">
                <img
                  src={coverImage}
                  alt="表紙プレビュー"
                  className="w-32 h-48 object-cover rounded border border-stone-300"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">
              説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={6}
              {...register("description")}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-stone-700 mb-1">
              評価
            </label>
            <select
              id="rating"
              {...register("rating", {
                setValueAs: (v) => (v === "" ? undefined : Number.parseInt(v, 10)),
              })}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">未評価</option>
              <option value="1">★☆☆☆☆ (1)</option>
              <option value="2">★★☆☆☆ (2)</option>
              <option value="3">★★★☆☆ (3)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="5">★★★★★ (5)</option>
            </select>
            {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              {isSubmitting ? "保存中..." : "保存"}
            </button>
            <Link
              to={`/books/${id}`}
              className="flex-1 bg-stone-200 text-stone-700 py-2 px-4 rounded-md text-center hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:ring-offset-2 transition-colors"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookEdit
