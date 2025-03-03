"use client"; // Required for Next.js App Router

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname=usePathname()

    /**
     * Register User
     */
    const registerUser = async (userData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/api/auth/register", userData, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            console.log("Registration successful:", response.data);
            router.push("/login");
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
        }

        setLoading(false);
    };

    const updatePass = async (userData) => {
        setLoading(true);
        try {
            const response = await axios.post("/api/auth/updateProfileAndLogin", userData, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            console.log("Registration successful:", response.data);
            router.push("/dashboard");
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
        }

        setLoading(false);
    };
    /**
     * Login User
     */
    const loginUser = async (credentials) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/api/auth/login", credentials, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            const { accessToken } = response.data;
            console.log("Login successful:", response.data);
            if (accessToken) {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
        }
        setLoading(false);
    };
    /**
     * logout
     */
    const logout = async () => {
        try {
            const response=await axiosInstance.post('/api/auth/logout', {},{ withCredentials: true });
            console.log(response)
            if(response.data.message=="Logged out successfully"){
                router.push('/login')
            }
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await axiosInstance.get("/api/auth/me", {
                withCredentials: true,
            });
            console.log(response.data)
    

            if (response.data.isAuthenticated) {
                if (pathname === "/login" || pathname === "/register" || pathname === "/") {
                    router.push("/dashboard");
                }
            } else {
                if (pathname === "/dashboard" || pathname === "/") {
                    router.push("/login");
                }
            }
        } catch (error) {
            console.log("User is not authenticated");
            if (pathname === "/dashboard") {
                router.push("/login");
            }
            // Handle invalid routes with a custom message or page
        
        }
    };


    return (
        <AuthContext.Provider value={{ register: registerUser, loading, loginUser, updatePass,logout,checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
