import React, { useState, useEffect, useMemo } from "react";
import Api from "../api/client";
import Navbar from "../components/Navbar";
import ContactModal from "../components/ContactModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import {
    Plus,
    Search,
    User,
    MapPin,
    Calendar,
    Phone,
    Edit2,
    Trash2,
    Loader2,
    BookUser,
    CheckCircle2,
    XCircle,
} from "lucide-react";

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    // Modal Delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Toast Notification
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await Api.get("/contact");
            setContacts(response.data.data || []);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            showToast("Gagal memuat data kontak", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Filter kontak berdasarkan nama, alamat, atau nomor telepon
    const filteredContacts = useMemo(() => {
        if (!searchQuery.trim()) return contacts;
        const q = searchQuery.toLowerCase();
        return contacts.filter((c) => {
            const matchName = c.nama?.toLowerCase().includes(q);
            const matchAlamat = c.alamat?.toLowerCase().includes(q);
            const matchPhone = c.telepon?.some((p) =>
                (p.nomer_telepon || p.nomor_telepon || "").toLowerCase().includes(q)
            );
            return matchName || matchAlamat || matchPhone;
        });
    }, [contacts, searchQuery]);

    const handleOpenAddModal = () => {
        setSelectedContact(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (contact) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const handleOpenDeleteModal = (contact) => {
        setContactToDelete(contact);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!contactToDelete) return;
        setDeleteLoading(true);
        try {
            await Api.delete(`/contact/${contactToDelete.id}`);
            showToast("Kontak berhasil dihapus", "success");
            setIsDeleteModalOpen(false);
            setContactToDelete(null);
            fetchContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
            showToast("Gagal menghapus kontak", "error");
        } finally {
            setDeleteLoading(false);
        }
    };

    const getBadgeStyle = (jenis) => {
        switch (jenis) {
            case "HP":
                return "bg-sky-50 text-sky-700 border-sky-200/60";
            case "Rumah":
                return "bg-amber-50 text-amber-700 border-amber-200/60";
            case "Kantor":
                return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
            default:
                return "bg-zinc-100 text-zinc-700 border-zinc-200";
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar />

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-zinc-900 text-white text-xs font-medium rounded-xl shadow-lg animate-slide-up">
                    {toast.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span>{toast.message}</span>
                </div>
            )}

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                            Buku Kontak
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                            Kelola semua kontak dan nomor telepon Anda dalam satu tempat
                        </p>
                    </div>

                    <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Kontak</span>
                    </button>
                </div>

                {/* Search & Stats Bar */}
                <div className="bg-white p-3 sm:p-4 rounded-2xl border border-zinc-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama, alamat, nomor telepon..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="text-xs text-zinc-500 font-medium">
                        Total: <span className="font-bold text-zinc-900">{filteredContacts.length}</span> kontak
                    </div>
                </div>

                {/* Konten Utama (Grid Kontak) */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-3 text-zinc-600" />
                        <span className="text-xs font-medium">Memuat data kontak...</span>
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-zinc-200 border-dashed p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mb-3">
                            <BookUser className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-zinc-900">
                            {searchQuery ? "Kontak tidak ditemukan" : "Belum ada kontak tersimpan"}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                            {searchQuery
                                ? `Tidak ada hasil yang cocok dengan kata kunci "${searchQuery}".`
                                : "Mulai tambahkan kontak baru untuk mengelola nomor telepon rekan atau keluarga Anda."}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={handleOpenAddModal}
                                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-xl transition-all shadow-sm cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Kontak Pertama</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <div>
                                    {/* Header Kartu: Nama & Aksi */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-800 font-semibold text-sm">
                                                {contact.nama ? contact.nama.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                                                    {contact.nama}
                                                </h3>
                                                <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-0.5">
                                                    <Calendar className="w-3 h-3 text-zinc-400" />
                                                    <span>{formatDate(contact.tanggal_lahir)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenEditModal(contact)}
                                                className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                                                title="Edit Kontak"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteModal(contact)}
                                                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="Hapus Kontak"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Alamat */}
                                    <div className="flex items-start gap-1.5 text-xs text-zinc-600 mb-4 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2 leading-relaxed">{contact.alamat}</span>
                                    </div>
                                </div>

                                {/* Nomor Telepon */}
                                <div className="pt-3 border-t border-zinc-100">
                                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                                        Nomor Telepon
                                    </span>
                                    {contact.telepon && contact.telepon.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {contact.telepon.map((telp, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getBadgeStyle(
                                                        telp.jenis
                                                    )}`}
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    <span>{telp.nomer_telepon || telp.nomor_telepon}</span>
                                                    <span className="text-[10px] opacity-75 font-normal">
                                                        ({telp.jenis})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-400 italic">
                                            Belum ada nomor telepon tersimpan
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal Tambah / Edit Kontak */}
            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    showToast(
                        selectedContact
                            ? "Kontak berhasil diperbarui"
                            : "Kontak baru berhasil ditambahkan",
                        "success"
                    );
                    fetchContacts();
                }}
                contact={selectedContact}
            />

            {/* Modal Konfirmasi Hapus */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                contactName={contactToDelete?.nama || ""}
                loading={deleteLoading}
            />
        </div>
    );
}
