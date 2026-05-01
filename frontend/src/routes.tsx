import { createBrowserRouter, Navigate } from "react-router"
import Layout from "./components/Layout"
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
    ],
  },
])

export { router }
