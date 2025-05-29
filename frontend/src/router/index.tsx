// src/router/AppRouter.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import LoginPage from "../components/pages/LoginPage/LoginPage";
import RegisterPage from "../components/pages/RegisterPage/RegisterPage";
import MainPage from "../components/pages/MainPage/MainPage";
import CartPage from "../components/pages/CartPage/CartPage";
import AdminPage from "../components/pages/AdminPage/AdminPage";
import ProfilePage from "../components/pages/ProfilePage/ProfilePage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute"; // ✅ добавили

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            index
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path="login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Защищённые маршруты */}
          <Route
            path="cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />
          <Route
            path="admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* TODO: Можно добавить страницу 404 */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
