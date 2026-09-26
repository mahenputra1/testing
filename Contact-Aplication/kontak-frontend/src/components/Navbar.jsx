import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, BookUser, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm">
                        <BookUser className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight leading-none">
                            KontakApp
                        </h1>
                        <span className="text-xs text-zinc-500 font-medium">
                            Manajemen Kontak Fullstack
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user && (
                        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200/60 text-xs text-zinc-700">
                            <div className="w-6 h-6 rounded-full bg-zinc-300 flex items-center justify-center text-zinc-700 font-medium">
                                <UserIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-semibold text-zinc-900">{user.name}</span>
                            <span className="text-zinc-400">•</span>
                            <span className="text-zinc-500">{user.email}</span>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-600 hover:text-red-600 bg-zinc-50 hover:bg-red-50 border border-zinc-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                        title="Keluar dari Akun"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Keluar</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
