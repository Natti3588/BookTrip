import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate } from "react-router"
import Layout from "./components/Layout"
import Loading from "./components/Loading"
import RequireAuth from "./components/RequireAuth"

const Home = lazy(() => import("./pages/Home"))
const BookList = lazy(() => import("./pages/BookList"))
const BookDetail = lazy(() => import("./pages/BookDetail"))
const BookAdd = lazy(() => import("./pages/BookAdd"))
const BookEdit = lazy(() => import("./pages/BookEdit"))
const MyBooks = lazy(() => import("./pages/MyBooks"))
const Profile = lazy(() => import("./pages/Profile"))
const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/Signup"))

const router = createBrowserRouter([
  {
    path: "login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "signup",
    element: (
      <Suspense fallback={<Loading />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "books", element: <BookList /> },
      { path: "books/:id", element: <BookDetail /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "books/add", element: <BookAdd /> },
          { path: "books/:id/edit", element: <BookEdit /> },
          { path: "my-books", element: <MyBooks /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
])

export { router }
