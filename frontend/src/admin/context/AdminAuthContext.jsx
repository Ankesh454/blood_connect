import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("bloodconnect_admin");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    // Admin credential check or demo authentication
    if (
      (email === "admin@bloodconnect.com" && password === "admin123") ||
      (email.toLowerCase().includes("admin") && password.length >= 6)
    ) {
      const adminData = {
        name: "Admin Officer",
        email: email,
        role: "Super Admin",
        avatar: "AO",
        token: "admin-jwt-token-demo",
      };
      setAdmin(adminData);
      localStorage.setItem("bloodconnect_admin", JSON.stringify(adminData));
      return { success: true };
    }
    return {
      success: false,
      message: "Invalid credentials. Try: admin@bloodconnect.com / admin123",
    };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("bloodconnect_admin");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
