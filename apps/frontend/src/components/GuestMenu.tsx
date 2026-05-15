import { Link } from "react-router"

const GuestMenu = () => {
  return (
    <>
      <Link
        to="/login"
        className="flex items-center space-x-1 px-3 py-2 text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
      >
        ログイン
      </Link>
      <Link
        to="/signup"
        className="flex items-center space-x-1 px-3 py-2 text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
      >
        新規登録
      </Link>
    </>
  )
}

export default GuestMenu