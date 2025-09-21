"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export enum UserRole {
  SALES = "sales",
  ADMIN = "admin",
  // MANAGER = "manager",
  // add more roles here
}

export type User = {
  email: string;
  username: string;
  full_name: string;
  role: UserRole;
  regions: string[];
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};


type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
   const { toast } = useToast()

  // Call backend to login (it sets cookie automatically)
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/login`,
      { username:email, password },
      { withCredentials: true } // <- important to allow cookies
      );
      const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now
      Cookies.set("access_token", res?.data?.access_token, {
        expires: expirationDate,
        path: "/",
        sameSite: "strict",
      });
      await fetchUser(); // get user profile after login
      toast({
        title: "Login successful",
        description: "Welcome to TechHub Admin Dashboard",
      })
      router.push("/dashboard")
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      })
      console.error("Login failed:", error);
      throw error;
    }
    
  };

  const logout = async () => {
    await axios.post("/api/logout", {}, { withCredentials: true });
    setUser(null);
  };
  
  const token = Cookies.get("access_token");
  const fetchUser = async () => {
    try {
      if (!token) {
        setUser(null);
        return;
      }
      const res = await axios.get<User>(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me`, { headers : { Authorization: `Bearer ${token}` } });
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
