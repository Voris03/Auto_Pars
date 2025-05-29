// src/router/PublicRoute.tsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Загрузка...</div>;

  return user ? <Navigate to="/profile" replace /> : <>{children}</>;
};

export default PublicRoute;