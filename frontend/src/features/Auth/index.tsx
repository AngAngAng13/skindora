import React from "react";
import { useLocation } from "react-router-dom";

import { LoginForm } from "./components/Forms/Login";
import { RegisterForm } from "./components/Forms/SignUp";
import { useAuthSwitcher } from "./hooks/useAuthSwitcher";

export default function AuthPage() {
  const LeftPanelVariant = useAuthSwitcher();
  const location = useLocation();

  let FormComponentToRender: React.JSX.Element | null = null;

  if (location.pathname === "/auth/login") {
    FormComponentToRender = <LoginForm />;
  } else if (location.pathname === "/auth/register") {
    FormComponentToRender = <RegisterForm />;
  }

  if (!LeftPanelVariant || !FormComponentToRender) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <p>
          Invalid authentication page. Please navigate to{" "}
          <a href="/auth/login" className="text-primary underline">
            Login
          </a>
          or{" "}
          <a href="/auth/register" className="text-primary underline">
            Register
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen">
      {LeftPanelVariant}
      <div className="flex w-full flex-col items-center justify-center p-4 sm:p-8 lg:w-1/2">
        {FormComponentToRender}
      </div>
    </div>
  );
}
