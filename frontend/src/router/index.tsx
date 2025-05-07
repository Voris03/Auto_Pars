// src/router/AppRouter.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import LoginPage from "../components/pages/LoginPage/LoginPage";
import RegisterPage from "../components/pages/RegisterPage/RegisterPage";
import MainPage from "../components/pages/MainPage/MainPage";
import CartPage from "../components/pages/CartPage/CartPage"; // добавили

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cart" element={<CartPage />} /> {/* добавили */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;