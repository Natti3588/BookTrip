import { BookOpen, Calendar, Star, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { type Book, getBooks } from "../lib/books"

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    getBooks()
      .then((data) => setBooks(data))
      .catch((err: Error) => console.error("本の取得に失敗しました", err))
  }, [])

  const filteredBooks = books.filter((book) => {
    const term = searchTerm.toLowerCase()
    return (
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.genre.toLowerCase().includes(term)
    )
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-4">本の一覧</h1>
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
            {searchTerm ? "検索結果が見つかりませんでした" : "本が登録されていません"}
          </p>
          {!searchTerm && (
            <Link
              to="/books/add"
              className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              最初の本を追加する
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredBooks.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-3/4 bg-stone-200 overflow-hidden">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-stone-800 mb-2 line-clamp-2">{book.title}</h3>
                <div className="flex items-center text-sm text-stone-700 mb-1">
                  <User className="w-4 h-4 mr-1" />
                  <span>{book.author}</span>
                </div>
                <div className="flex items-center text-sm text-stone-700 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{book.publishedYear}年</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                    {book.genre}
                  </span>
                  {book.rating && book.rating > 0 && (
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                      <span className="text-xs text-stone-700">{book.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookList
