import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookUser, User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setFieldErrors({});

        try {
            await register(name, email, password);
            navigate("/");
        } catch (err) {
            if (err.response?.data?.errors) {
                setFieldErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage("Gagal mendaftar. Silakan periksa data input Anda.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4 sm:p-6">
            <div className="w-full max-w-sm">
                {/* Branding */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-md mb-3">
                        <BookUser className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                        Buat Akun Baru
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                        Mulai simpan dan kelola data kontak Anda
                    </p>
                </div>

                {/* Card Form */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm">
                    {errorMessage && (
                        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Alex Rivers"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                                />
                            </div>
                            {fieldErrors.name && (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.email[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                                Password (min. 8 karakter)
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                                />
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.password[0]}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Daftar Akun</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
                        <p className="text-xs text-zinc-500">
                            Sudah punya akun?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-zinc-900 hover:underline"
                            >
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
