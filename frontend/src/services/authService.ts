import { apiClient } from "@/lib/apiClient";
import type {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
} from "@/schemas/authSchemas";

interface AuthResponse {
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
    user?: "user" | "admin" | "staff";
  };
}

interface UserProfileResponse {
  message: string;
  result: any;
}

export const authService = {
  login: async (credentials: LoginFormData) => {
    return apiClient.post<AuthResponse, LoginFormData>("/users/login", credentials, { skipAuth: true });
  },

  register: async (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars , unused-imports/no-unused-vars
    const { confirmPassword, ...registerData } = data;
    return apiClient.post<AuthResponse, Omit<RegisterFormData, "confirmPassword">>("/users/register", registerData, {
      skipAuth: true,
    });
  },

  logout: async (refreshToken: string) => {
    return apiClient.post<{ message: string }, { refresh_token: string }>("/users/logout", {
      refresh_token: refreshToken,
    });
  },

  forgotPassword: async (data: ForgotPasswordFormData) => {
    return apiClient.post<{ message: string }, ForgotPasswordFormData>("/users/forgot-password", data, {
      skipAuth: true,
    });
  },

  resetPassword: async (token: string, data: ResetPasswordFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    const { confirmPassword, ...resetData } = data;
    return apiClient.post<{ message: string }, Omit<ResetPasswordFormData, "confirmPassword">>(
      `/users/reset-password?forgot_password_token=${token}`,
      resetData,
      { skipAuth: true }
    );
  },

  getMe: async () => {
    return apiClient.get<UserProfileResponse>("/users/me");
  },
};
