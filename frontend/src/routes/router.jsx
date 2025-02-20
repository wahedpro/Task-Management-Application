import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/dashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage></HomePage>,
        children : [
            {
                path: "/",
                element: <Dashboard></Dashboard>
            },
            {
                path: "login",
                element: <LoginPage></LoginPage>
            }
        ]
    },
]);

export default router;