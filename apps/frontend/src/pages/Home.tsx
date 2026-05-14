import { Star } from "lucide-react"
import { useEffect, useState } from "react"
import { SiGithub } from "react-icons/si"
import { Link } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import { type Book, getBooks } from "../lib/books"

const Home = () => {
  const [books, setBooks] = useState<Book[]>([])
  const { currentUser } = useAuth()
  const GITHUB_URL = "https://github.com/Natti3588"

  // レンダリング時に本のデータを取得
  useEffect(() => {
    getBooks()
      .then((data) => setBooks(data))
      .catch((err: Error) => console.error("本の取得に失敗しました", err))
  }, [])

  // おすすめの本（最新の6冊をおすすめとして表示）
  const recommendedBooks = books.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/*ファーストビュー */}
      <section className="min-h-[80vh] flex items-center justify-center bg-linear-to-br from-amber-100 via-orange-100 to-yellow-50 px-4">
        <div className="text-center text-stone-800 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-amber-900">Book Trip</h1>
          <p className="text-xl md:text-2xl text-stone-700 mb-8">
            あなたの読書体験を記録し、共有する
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/books"
              className="px-8 py-3 bg-white text-amber-700 rounded-lg font-bold hover:bg-amber-50 transition-colors shadow-md border border-amber-200"
            >
              本を探す
            </Link>
            {currentUser ? (
              <Link
                to="/books/add"
                className="px-8 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors shadow-md"
              >
                本を追加
              </Link>
            ) : (
              <Link
                to="/signup"
                className="px-8 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors shadow-md"
              >
                登録して本を追加する
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* おすすめ本のセクション */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
              <h2 className="text-3xl font-bold text-stone-800">おすすめの本</h2>
            </div>
            <Link to="/books" className="text-amber-700 hover:text-amber-800 font-medium">
              すべて見る →
            </Link>
          </div>

          {recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {recommendedBooks.map((book) => (
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
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-stone-800 line-clamp-2 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-1">{book.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-stone-200">
              <p className="text-stone-700 mb-4">まだ本が登録されていません</p>
              <Link
                to="/books/add"
                className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                最初の本を追加する
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Aboutセクション */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">読書記録をもっと楽しく</h2>
          <p className="text-stone-700 text-lg leading-relaxed mb-8">
            Book Tripは、あなたの読書体験を記録し共有するシンプルなアプリケーションです。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-bold text-lg text-stone-800 mb-2">簡単管理</h3>
              <p className="text-stone-600 text-sm">
                直感的なインターフェースで本を簡単に追加・編集
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold text-lg text-stone-800 mb-2">素早い検索</h3>
              <p className="text-stone-600 text-sm">タイトル・著者・ジャンルから瞬時に検索</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="font-bold text-lg text-stone-800 mb-2">セッション管理</h3>
              <p className="text-stone-600 text-sm">一度ログインすれば快適に</p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-12 bg-stone-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p></p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors"
          >
            <SiGithub className="w-6 h-6" />
            <span>GitHub でコードを見る</span>
          </a>
          <p className="text-stone-400 text-sm mt-8">© 2026 Book Trip</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
