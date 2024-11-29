import {createBrowserRouter} from "react-router-dom";
import AuthView from "../views/AuthView.tsx";
import RegistrationView from "../views/RegistrationView.tsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <AuthView />
  },
  {
    path: "/registration",
    element: <RegistrationView />
  }
])

export default router