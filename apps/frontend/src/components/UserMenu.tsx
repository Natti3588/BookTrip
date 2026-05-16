import { ChevronDown, LogOut, User, BookHeart } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { useAuth } from "../contexts/AuthContext"

const UserMenu = () => {
  const { currentUser, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 外側クリックで閉じる
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Esc キーで閉じる
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen])

  if (!currentUser) return null

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-1 px-3 py-2 text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="text-sm hidden sm:inline">{currentUser.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-stone-200 py-1 z-50"
        >
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2 px-4 py-2 text-stone-700 hover:bg-stone-100 transition-colors"
            role="menuitem"
          >
            <User className="w-4 h-4" />
            <span>プロフィール</span>
          </Link>
          <Link
            to="/my-books"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2 px-4 py-2 text-stone-700 hover:bg-stone-100 transition-colors"
            role="menuitem">
            <BookHeart className="w-4 h-4" />
            <span>自分の本一覧</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              logout()
            }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-stone-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            role="menuitem"
          >
            <LogOut className="w-4 h-4" />
            <span>ログアウト</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
