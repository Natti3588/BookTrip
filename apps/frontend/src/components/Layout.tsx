import { BookOpen, Home, Library, LogOut, Plus } from "lucide-react"
import { Link, NavLink, Outlet, useLocation } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import UserMenu from "./UserMenu"
import GuestMenu from "./GuestMenu"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
    isActive ? "bg-amber-100 text-amber-800" : "text-stone-700 hover:bg-stone-100"
  }`

const Layout = () => {
  const location = useLocation()
  const { currentUser } = useAuth()

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/home" className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-amber-700" />
              <span className="text-2xl font-bold text-stone-800">Book Trip</span>
            </Link>

            <nav className="flex items-center space-x-4">
              <NavLink to="/home" end className={navLinkClass}>
                <Home className="w-5 h-5" />
                <span>ホーム</span>
              </NavLink>

              <NavLink to="/books" end className={navLinkClass}>
                <Library className="w-5 h-5" />
                <span>本の一覧</span>
              </NavLink>

              {currentUser && (
                <NavLink to="/books/add" end className={navLinkClass}>
                  <Plus className="w-5 h-5" />
                  <span>本を追加</span>
                </NavLink>
              )}

              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-stone-200">
                {currentUser ? (
                  <UserMenu />
                ) : (
                  <GuestMenu />
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main
        className={
          location.pathname === "/home" ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        }
      >
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
