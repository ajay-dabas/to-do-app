import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppRoutes } from "./config/routes";
import Homepage from "./pages/home";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import "./app.css";

function App() {
  return (
    <>
      <ToastContainer newestOnTop autoClose={2000} />
      <Routes>
        <Route path={AppRoutes.home.path} element={<Homepage />} />
        <Route path={AppRoutes.dashboard.path} element={<Dashboard />} />
        <Route path={AppRoutes.login.path} element={<Login />} />
        <Route path={AppRoutes.register.path} element={<Register />} />
        <Route path="*" element={<Homepage />} />
      </Routes>
    </>
  );
}

export { App };
