import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { LoginFormData, RegisterFormData } from "@/schemas/authSchemas";
import { authService } from "@/services/authService";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/utils/tokenManager";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    if (!getAccessToken()) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const response = await authService.getMe();
      if (response.isOk()) {
        setUser(response.value.data.result as User);
        setIsAuthenticated(true);
      } else {
        console.error("Failed to fetch user profile:", response.error.message);

        if (response.error.status === 401) {
          clearTokens();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Critical error fetching user profile:", error);
      clearTokens();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchUserProfile();

    const handleAuthFailure = () => {
      toast.error("Session Expired", { description: "Please log in again." });
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate("/auth/login");
    };

    window.addEventListener("auth:session_expired", handleAuthFailure);
    window.addEventListener("auth:refresh_failed", handleAuthFailure);

    return () => {
      window.removeEventListener("auth:session_expired", handleAuthFailure);
      window.removeEventListener("auth:refresh_failed", handleAuthFailure);
    };
  }, [fetchUserProfile, navigate]);

  const login = async (credentials: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.isOk()) {
        const { access_token, refresh_token, user: loggedInUser } = response.value.data.result;
        setTokens(access_token, refresh_token);
        await fetchUserProfile();
        toast.success("Login Successful", { description: "Welcome back!" });
        const defaultUnwrappedShape = { data: { result: null } };
        const unwrappedApiResponse = (await authService.getMe()).unwrapOr(defaultUnwrappedShape);

        const targetUser = loggedInUser || (user ?? unwrappedApiResponse.data.result);
        navigate(targetUser?.role === "Admin" ? "/admin" : "/profile");
        // TODO: hoi nguyen vu role
      } else {
        const errorData = response.error.data as Partial<{ message: string; [key: string]: any }>;
        const errorDescription = errorData?.message || response.error.message || "Invalid credentials.";
        toast.error("Login Failed", { description: errorDescription });
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (e) {
      toast.error("Login Error", { description: "An unexpected error occurred during login." });
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.isOk()) {
        const { access_token, refresh_token } = response.value.data.result;
        //oke thi set token
        setTokens(access_token, refresh_token);
        //check lai user update roi set
        await fetchUserProfile();
        toast.success("Registration Successful", { description: "Welcome! Your account has been created." });
        navigate("/profile"); // cai nay thi tuy nguyen
      } else {
        const errorData = response.error.data as Partial<{ message: string; [key: string]: any }>;
        const errorDescription = errorData?.message || response.error.message || "Could not create account.";
        toast.error("Registration Failed", { description: errorDescription });
      }
    } catch (e) {
      toast.error("Registration Error", { description: "An unexpected error occurred during registration." });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const currentRefreshToken = getRefreshToken();
    if (currentRefreshToken) {
      try {
        await authService.logout(currentRefreshToken);
      } catch (error) {
        //delete locally
        console.warn("Logout API call failed, clearing tokens locally anyway.", error);
      }
    }
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    toast.info("Logged Out", { description: "You have been successfully logged out." });
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
