import { Calendar, Star, User } from "lucide-react"
import { Link } from "react-router"
import type { Book } from "../lib/books"

const FALLBACK_IMAGE = "https://placehold.co/300x450?text=No+Image"

type Props = {
  book: Book
  variant?: "compact" | "detailed"
}

const BookCard = ({ book, variant = "detailed" }: Props) => {
  const isDetailed = variant === "detailed"

  return (
    <Link
      to={`/books/${book.id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="aspect-3/4 bg-stone-200 overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
        />
      </div>

      <div className={isDetailed ? "p-4" : "p-3"}>
        <h3
          className={`font-serif font-bold text-stone-800 line-clamp-2 ${isDetailed ? "text-lg mb-2" : "text-sm mb-1"}`}
        >
          {book.title}
        </h3>
        {!isDetailed && <p className="text-xs text-stone-600 line-clamp-1">{book.author}</p>}
        {isDetailed && (
          <>
            <div className="flex items-center text-sm text-stone-700 mb-1">
              <User className="w-4 h-4 mr-1" />
              <span>{book.author}</span>
            </div>
            <div className="flex items-center text-sm text-stone-700 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{book.publishedYear}年</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                {book.genre}
              </span>
              {book.rating && (
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                  <span className="text-xs text-stone-700">{book.rating}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  )
}

export default BookCard
