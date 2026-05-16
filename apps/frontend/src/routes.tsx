import { createBrowserRouter, Navigate } from "react-router"
import Layout from "./components/Layout"
import BookAdd from "./pages/BookAdd"
import BookDetail from "./pages/BookDetail"
import BookEdit from "./pages/BookEdit"
import BookList from "./pages/BookList"
import Home from "./pages/Home"
import LoginPage from "./pages/Login"
import MyBooks from "./pages/MyBooks"
import Profile from "./pages/Profile"
import SignupPage from "./pages/Signup"

const router = createBrowserRouter([
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "books", element: <BookList /> },
      { path: "books/add", element: <BookAdd /> },
      { path: "books/:id", element: <BookDetail /> },
      { path: "books/:id/edit", element: <BookEdit /> },
      { path: "my-books", element: <MyBooks /> },
      { path: "profile", element: <Profile /> },
    ],
  },
])

export { router }
