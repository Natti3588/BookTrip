import { zodResolver } from "@hookform/resolvers/zod"
import { createBookSchema } from "backend/src/schemas/book"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { createBook, type createBookInput } from "../lib/books"

const GENRES = [
  "小説",
  "ノンフィクション",
  "ビジネス",
  "自己啓発",
  "科学",
  "歴史",
  "ファンタジー",
  "ミステリー",
  "SF",
  "ロマンス",
  "詩",
  "エッセイ",
  "その他",
] as const

const FALLBACK_IMAGE = "https://placehold.co/300x450?text=No+Image"

const BookAdd = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<createBookInput>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      author: "",
      publishedYear: new Date().getFullYear(),
      coverImage: "",
      description: "",
    },
  })

  const onSubmit = async (data: createBookInput) => {
    setServerError(null)
    try {
      await createBook(data)
      navigate("/books?added=true")
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "追加に失敗しました")
    }
  }

  const coverImage = watch("coverImage")

  return (
    <div className="max-w-2xl mx-auto">
      <button
        type="button"
        onClick={() => navigate("/books")}
        className="flex items-center text-stone-700 hover:text-stone-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        一覧に戻る
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-6">本を追加</h1>

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
              <option value="1">★☆☆☆☆ (1.0)</option>
              <option value="2">★★☆☆☆ (2.0)</option>
              <option value="3">★★★☆☆ (3.0)</option>
              <option value="4">★★★★☆ (4.0)</option>
              <option value="5">★★★★★ (5.0)</option>
            </select>
            {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              {isSubmitting ? "追加中..." : "追加する"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/books")}
              disabled={isSubmitting}
              className="flex-1 bg-purple-200 text-stone-700 py-2 px-4 rounded-md hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookAdd
