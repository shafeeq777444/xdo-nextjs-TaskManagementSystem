"use client"; // ✅ Required for Next.js hooks

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const useAuthRedirect = () => {
    const router = useRouter(); // ✅ Now it works
    const pathname = usePathname();
    const {checkAuth}=useAuth()

    useEffect(() => {
        checkAuth();
    }, [pathname, router]); // ✅ Include router in dependencies
};

export default useAuthRedirect;
