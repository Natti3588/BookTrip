import { createBrowserRouter, Navigate } from "react-router"
import Layout from "./components/Layout"
import BookAdd from "./pages/BookAdd"
import BookDetail from "./pages/BookDetail"
import BookEdit from "./pages/BookEdit"
import BookList from "./pages/BookList"
import Home from "./pages/Home"

const router = createBrowserRouter([
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
    ],
  },
])

export { router }
