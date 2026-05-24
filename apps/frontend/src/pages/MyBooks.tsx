import { useQuery } from "@tanstack/react-query"
import { BookOpen } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import BookCard from "../components/BookCard"
import { useAuth } from "../contexts/AuthContext"
import { getMyBooks } from "../lib/books"

const MyBooks = () => {
  const { currentUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books", "me"],
    queryFn: getMyBooks,
  })

  const term = searchTerm.toLowerCase()
  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.genre.toLowerCase().includes(term)
    )
  })

  if (isLoading) return <p className="text-stone-600">読み込み中...</p>
  if (isError) {
    console.error(error)
    return <p className="text-red-600">本の取得に失敗しました</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl text-stone-800 mb-4">自分の本一覧</h1>
        <input
          type="text"
          placeholder="本のタイトル、著者、ジャンルで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        />
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-stone-400 mx-auto mb-4" />
          <p className="text-stone-700 text-lg">
            {searchTerm ? "検索結果が見つかりませんでした" : "自分の本が登録されていません"}
          </p>
          {!searchTerm &&
            (currentUser ? (
              <Link
                to="/books/add"
                className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                最初の本を追加する
              </Link>
            ) : (
              <Link
                to="/signup"
                className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                登録して最初の本を追加する
              </Link>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBooks
