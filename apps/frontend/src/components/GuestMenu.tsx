import { Link } from "react-router"

const GuestMenu = () => {
  return (
    <>
      <Link
        to="/login"
        className="px-2 sm:py-3 text-sm sm:text-base text-stone-700 hover:bg-stone-100 rounded-md transition-colors whitespace-nowrap"
      >
        ログイン
      </Link>
      <Link
        to="/signup"
        className="px-2 sm:py-3 text-sm sm:text-base text-stone-700 hover:bg-stone-100 rounded-md transition-colors whitespace-nowrap"
      >
        新規登録
      </Link>
    </>
  )
}

export default GuestMenu
