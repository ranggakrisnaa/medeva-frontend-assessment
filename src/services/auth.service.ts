import { api } from "@/lib/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  content: {
    userId: string;
    accessToken: string;
  };
  errors?: Array<string | Record<string, unknown>>;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data.content;
  },
};
