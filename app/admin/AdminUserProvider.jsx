"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { decodeJWT } from "@/lib/utils";

export const AdminUserContext = createContext(null);

export function AdminUserProvider({ user: initialUser, children }) {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is already set, do nothing (unless we want to re-verify)
    // But for static export, initialUser is likely null.
    if (user) return;

    const token = localStorage.getItem('token'); // Or check cookie if you sync them
    // Note: The original server-side code used cookies. 
    // If your login sets a cookie httpOnly, client JS can't read it.
    // Assuming the login also sets localStorage or a readable cookie.

    // Fallback to checking document.cookie if localStorage is empty
    let tokenToVerify = token;
    if (!tokenToVerify) {
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      if (match) tokenToVerify = match[2];
    }

    if (tokenToVerify) {
      const decoded = decodeJWT(tokenToVerify);
      if (decoded) {
        // Check expiration if 'exp' is in payload
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          console.log("Token expired");
          handleLogout();
          return;
        }
        setUser(decoded);
      } else {
        handleLogout();
      }
    } else {
      // No token found, user is null.
      // Redirect to login if on a protected page?
      // Let's rely on the pages/layout logic or implement it here.
      // Original layout redirected to /not-authorized
      handleLogout();
    }
  }, [user, pathname]);

  const handleLogout = () => {
    setUser(null);
    // Only redirect if we are in admin pages (excluding login if it was here)
    if (pathname?.startsWith('/admin')) {
      // router.push('/admin/login'); // Or not-authorized
      // For now, we update state. The components checking permissions will react.
    }
  };

  return (
    <AdminUserContext.Provider value={user}>
      {children}
    </AdminUserContext.Provider>
  );
}

// Custom hook for convenience
export function useAdminUser() {
  return useContext(AdminUserContext);
}
