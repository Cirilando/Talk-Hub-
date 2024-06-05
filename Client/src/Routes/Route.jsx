import { createBrowserRouter } from "react-router-dom";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import Message from "../Components/Message";
import App from "../App";
import AuthLayout from "../Layout/layouts";
import Password from "../Pages/Password";
import Email from "../Pages/Email";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: (
          <AuthLayout>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path: "email",
        element: (
          <AuthLayout>
            <Email />,
          </AuthLayout>
        ),
      },
      {
        path: "password",
        element: (
          <AuthLayout>
            <Password />,
          </AuthLayout>
        ),
      },
      {
        path: "home",
        element: (
          <Home/>
        ),
        children: [
          {
            path: ":userId",
            element: <Message />,
          },
        ],
      },
    ],
  },
]);
export default router;
