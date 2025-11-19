import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth.service";
import type { LoginRequest } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

// Login mutation
export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      console.log("Login response data:", data);
      console.log("Access token:", data.content?.accessToken);
      console.log("User ID:", data.content?.userId);

      // Store token and userId
      if (data.content?.accessToken) {
        localStorage.setItem("token", data.content.accessToken);
        console.log("Token saved to localStorage");
      } else {
        console.error("No access token in response");
      }

      if (data.content?.userId) {
        localStorage.setItem("userId", data.content.userId);
      }
      localStorage.setItem("isAuthenticated", "true");

      // Invalidate and refetch user query
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Navigate to dashboard
      navigate("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
}

// Get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });
}

// Logout
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");

    // Clear queries
    queryClient.clear();

    // Navigate to login
    navigate("/login");
  };
}
