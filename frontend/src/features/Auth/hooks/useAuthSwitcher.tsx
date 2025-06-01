import React from "react";
import { useLocation } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

export function useAuthSwitcher(): React.JSX.Element | null {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === "/auth/login") {
    return <LoginPage />;
  }

  if (pathname === "/auth/register") {
    return <RegisterPage />;
  }

  return null;
}
