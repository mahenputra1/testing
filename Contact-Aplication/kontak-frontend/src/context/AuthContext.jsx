import React, { createContext, useContext, useState, useEffect } from "react";
import Api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await Api.post("/login", { email, password });
            const { user: userData, token: userToken } = response.data.data;
            setUser(userData);
            setToken(userToken);
            return response.data;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const response = await Api.post("/register", { name, email, password });
            const { user: userData, token: userToken } = response.data.data;
            setUser(userData);
            setToken(userToken);
            return response.data;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await Api.post("/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
