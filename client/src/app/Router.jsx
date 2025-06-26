import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProductPage from "../pages/ProductPage";
import ConcertPage from "../pages/ConcertPage";
import CartPage from "../pages/CartPage";
import QA from "../pages/QA";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/register",
                element: <RegisterPage/>
            },
            {
                path: "/login",
                element: <LoginPage/>
            },
            {
                path: "/product",
                element: <ProductPage/>
            },
            {
                path: "/concert",
                element: <ConcertPage/>
            },
            {
                path: "/cart",
                element: <CartPage/>
            },
            {
                path: "/QA",
                element: <QA/>
            },
        ]
    }
])
export default router