import { createBrowserRouter } from "react-router-dom";
import Layout from "../../widget/Layout";
import {
  RegisterPage,
  LoginPage,
  CartPage,
  ConcertPage,
  QA,
  ProductPage,
  HomePage,
} from "../../pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/product",
        element: <ProductPage />,
      },
      {
        path: "/concert",
        element: <ConcertPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/QA",
        element: <QA />,
      },
    ],
  },
]);
export default router;
