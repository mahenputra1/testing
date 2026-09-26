import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, contactName, loading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
            <div 
                className="bg-white rounded-2xl w-full max-w-sm shadow-xl border border-zinc-200 p-6 flex flex-col items-center text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                
                <h3 className="text-base font-semibold text-zinc-900 mb-1">
                    Hapus Kontak?
                </h3>
                <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                    Apakah Anda yakin ingin menghapus kontak <strong className="text-zinc-800 font-medium">{contactName}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex items-center gap-2.5 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Hapus</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
