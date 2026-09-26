import React, { useState, useEffect } from "react";
import Api from "../api/client";
import { X, Plus, Trash2, Phone, User, MapPin, Calendar, Loader2 } from "lucide-react";

export default function ContactModal({ isOpen, onClose, onSuccess, contact = null }) {
    const isEditing = !!contact;

    const [nama, setNama] = useState("");
    const [alamat, setAlamat] = useState("");
    const [tanggalLahir, setTanggalLahir] = useState("");
    const [phones, setPhones] = useState([{ jenis: "HP", nomor_telepon: "" }]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    useEffect(() => {
        if (contact) {
            setNama(contact.nama || "");
            setAlamat(contact.alamat || "");
            setTanggalLahir(contact.tanggal_lahir ? contact.tanggal_lahir.split("T")[0] : "");
            
            if (contact.telepon && contact.telepon.length > 0) {
                setPhones(
                    contact.telepon.map((p) => ({
                        jenis: p.jenis || "HP",
                        nomor_telepon: p.nomer_telepon || p.nomor_telepon || "",
                    }))
                );
            } else {
                setPhones([{ jenis: "HP", nomor_telepon: "" }]);
            }
        } else {
            setNama("");
            setAlamat("");
            setTanggalLahir("");
            setPhones([{ jenis: "HP", nomor_telepon: "" }]);
        }
        setErrors({});
        setGeneralError("");
    }, [contact, isOpen]);

    if (!isOpen) return null;

    const handleAddPhone = () => {
        setPhones([...phones, { jenis: "HP", nomor_telepon: "" }]);
    };

    const handleRemovePhone = (index) => {
        if (phones.length === 1) {
            setPhones([{ jenis: "HP", nomor_telepon: "" }]);
            return;
        }
        setPhones(phones.filter((_, i) => i !== index));
    };

    const handlePhoneChange = (index, field, value) => {
        const updated = [...phones];
        updated[index][field] = value;
        setPhones(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setGeneralError("");

        // Filter nomor telepon yang tidak kosong
        const cleanPhones = phones.filter((p) => p.nomor_telepon.trim() !== "");

        const payload = {
            nama,
            alamat,
            tanggal_lahir: tanggalLahir,
            phones: cleanPhones,
        };

        try {
            if (isEditing) {
                await Api.put(`/contact/${contact.id}`, payload);
            } else {
                await Api.post("/contact", payload);
            }
            onSuccess();
            onClose();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setGeneralError(err.response.data.message);
            } else {
                setGeneralError("Terjadi kesalahan saat menyimpan data.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
            <div 
                className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-zinc-200 overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <h2 className="text-lg font-semibold text-zinc-900">
                        {isEditing ? "Edit Kontak" : "Tambah Kontak Baru"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 rounded-lg p-1 hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Konten */}
                <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4">
                    {generalError && (
                        <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
                            {generalError}
                        </div>
                    )}

                    {/* Nama */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                required
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Contoh: John Doe"
                                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                            />
                        </div>
                        {errors.nama && (
                            <p className="mt-1 text-xs text-red-500">{errors.nama[0]}</p>
                        )}
                    </div>

                    {/* Alamat */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                            Alamat <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                            <textarea
                                required
                                rows={2}
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                                placeholder="Alamat domisili lengkap..."
                                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none"
                            />
                        </div>
                        {errors.alamat && (
                            <p className="mt-1 text-xs text-red-500">{errors.alamat[0]}</p>
                        )}
                    </div>

                    {/* Tanggal Lahir */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                            Tanggal Lahir <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="date"
                                required
                                value={tanggalLahir}
                                onChange={(e) => setTanggalLahir(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                            />
                        </div>
                        {errors.tanggal_lahir && (
                            <p className="mt-1 text-xs text-red-500">{errors.tanggal_lahir[0]}</p>
                        )}
                    </div>

                    {/* Daftar Nomor Telepon */}
                    <div className="pt-2 border-t border-zinc-100">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-zinc-700">
                                Nomor Telepon
                            </label>
                            <button
                                type="button"
                                onClick={handleAddPhone}
                                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 hover:text-zinc-700 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Nomor</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            {phones.map((p, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <select
                                        value={p.jenis}
                                        onChange={(e) => handlePhoneChange(index, "jenis", e.target.value)}
                                        className="w-28 py-2 px-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
                                    >
                                        <option value="HP">HP</option>
                                        <option value="Rumah">Rumah</option>
                                        <option value="Kantor">Kantor</option>
                                    </select>

                                    <div className="relative flex-1">
                                        <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={p.nomor_telepon}
                                            onChange={(e) => handlePhoneChange(index, "nomor_telepon", e.target.value)}
                                            placeholder="Nomor (cth: 08123456789)"
                                            className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
                                        />
                                    </div>

                                    {phones.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePhone(index)}
                                            className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                            title="Hapus baris nomor"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Tombol Aksi */}
                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{isEditing ? "Simpan Perubahan" : "Tambah Kontak"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
