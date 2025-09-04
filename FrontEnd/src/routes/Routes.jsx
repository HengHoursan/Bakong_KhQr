import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import Home from "../views/Home";
import Product from "../views/Product";
import ProductCategory from "../views/ProductCategory";
import ProductCard from "../views/ProductCard";
import SaleHistory from "@/views/SaleHistory";
import ErrorPage from "../pages/ErrorPage";
import SidebarLayout from "../layouts/SidebarLayout";
// import Protected from "@/security/Protected.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/layout",
    element: <SidebarLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Product /> },
      { path: "productCategories", element: <ProductCategory /> },
      { path: "productCard", element: <ProductCard /> },
      { path: "salesHistory", element: <SaleHistory /> },
      { path: "*", element: <ErrorPage /> },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
