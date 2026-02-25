"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { User } from "@/types/user";

// Define the shape of the authentication state
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  twoFactorRequired: boolean;
  tempToken: string | null;
}

// Define the shape of the authentication context
interface AuthContextType extends AuthState {
  login: (data: any) => Promise<void>;
  verifyTwoFactor: (data: any) => Promise<void>;
  signup: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
  verifyEmail: (token: string) => Promise<any>;
  resendVerificationEmail: () => Promise<any>;
  setup2FA: () => Promise<any>;
  enable2FA: (data: any) => Promise<any>;
  updateUser: (data: Partial<User>) => Promise<any>;
  updateUserProfile: (data: Partial<User>) => Promise<any>;
  api: (endpoint: string, options?: RequestInit) => Promise<any>;
  handleSocialLogin: (
    accessToken: string,
    refreshToken: string
  ) => Promise<void>;
  handleSocialTwoFactor: (tempToken: string) => void;
}

// Create the authentication context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE;

// Authentication provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const refreshTokenFunc = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const { access_token, refresh_token: new_refresh_token } = await response.json();
      setAccessToken(access_token);
      setRefreshToken(new_refresh_token);
      Cookies.set("access_token", access_token, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refresh_token", new_refresh_token, {
        secure: true,
        sameSite: "strict",
      });
      return access_token;
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout();
      throw error;
    }
  };

  const api = async (endpoint: string, options: RequestInit = {}) => {
    let token = accessToken;
    if (token) {
      const decodedToken: { exp: number } = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        token = await refreshTokenFunc();
      }
    }

    const headers: any = {
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || errorData.detail || "An error occurred"
      );
    }

    return response.json();
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = Cookies.get("access_token");
      const storedRefreshToken = Cookies.get("refresh_token");

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        try {
          await fetchUser(storedAccessToken);
        } catch (error) {
          // fetchUser handles logout on error
        }
      } else {
        setLoading(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const fetchUser = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const userData = await response.json();
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      console.error(error);
      logout();
      throw error;
    }
  };

  const login = async (data: any) => {
    try {
      setIsLoading(true);
      const formBody = new URLSearchParams();
      formBody.append("username", data.username);
      formBody.append("password", data.password);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.detail || "An error occurred"
        );
      }

      const responseData = await response.json();

      if (responseData.two_factor_required) {
        setTwoFactorRequired(true);
        setTempToken(responseData.temp_token);
        toast({
          title: "Two-Factor Authentication",
          description: "Please enter your 2FA code.",
        });
        router.push("/auth/verify-2fa");
      } else {
        const { access_token, refresh_token } = responseData;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        Cookies.set("access_token", access_token, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refresh_token", refresh_token, {
          secure: true,
          sameSite: "strict",
        });
        await fetchUser(access_token);
        setTwoFactorRequired(false);
        setTempToken(null);
        toast({
          title: "Login successful",
          description: "Welcome to TechHub Admin Dashboard",
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async (data: any) => {
    try {
      const response = await api("/auth/login/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ ...data, temp_token: tempToken }),
      });
      const { access_token, refresh_token } = response;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      Cookies.set("access_token", access_token, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refresh_token", refresh_token, {
        secure: true,
        sameSite: "strict",
      });
      await fetchUser(access_token);
      setTwoFactorRequired(false);
      setTempToken(null);
      toast({
        title: "Login successful",
        description: "Welcome to TechHub Admin Dashboard",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("2FA verification failed", error);
      toast({
        title: "Verification failed",
        description: error.message || "Invalid 2FA code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (data: any) => {
    try {
      return await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      return await api("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.error("Email verification failed", error);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      return await api("/auth/resend-verification", {
        method: "POST",
      });
    } catch (error) {
      console.error("Resend verification email failed", error);
      throw error;
    }
  };

  const setup2FA = async () => {
    try {
      return await api("/auth/2fa/setup", {
        method: "POST",
      });
    } catch (error) {
      console.error("Setup 2FA failed", error);
      throw error;
    }
  };

  const enable2FA = async (data: any) => {
    try {
      const response = await api("/auth/2fa/enable", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (accessToken) {
        await fetchUser(accessToken);
      }
      return response;
    } catch (error) {
      console.error("Enable 2FA failed", error);
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedUser = await api("/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...updatedUser } : updatedUser
      );
      return updatedUser;
    } catch (error) {
      console.error("Update user failed", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      const updatedProfile = await api("/users/me/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...updatedProfile } : updatedProfile
      );
      return updatedProfile;
    } catch (error) {
      console.error("Update user profile failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (accessToken && refreshToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      router.push("/login");
    }
  };

  const handleSocialLogin = async (
    accessToken: string,
    refreshToken: string
  ) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    Cookies.set("access_token", accessToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refresh_token", refreshToken, {
      secure: true,
      sameSite: "strict",
    });
    await fetchUser(accessToken);
    router.push("/dashboard");
  };

  const handleSocialTwoFactor = (token: string) => {
    setTwoFactorRequired(true);
    setTempToken(token);
  };

  const authContextValue: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    isLoading,
    twoFactorRequired,
    tempToken,
    login,
    verifyTwoFactor,
    signup,
    logout,
    loading,
    verifyEmail,
    resendVerificationEmail,
    setup2FA,
    enable2FA,
    updateUser,
    updateUserProfile,
    api,
    handleSocialLogin,
    handleSocialTwoFactor,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
