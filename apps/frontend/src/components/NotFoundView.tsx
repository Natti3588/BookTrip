import { Link } from "react-router"

const NotFoundView = () => {
  return (
    <div className="text-center py-12">
      <p className="text-stone-600 text-lg">本が見つかりませんでした</p>
      <Link
        to="/books"
        className="inline-block mt-4 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
      >
        一覧に戻る
      </Link>
    </div>
  )
}

export default NotFoundView
