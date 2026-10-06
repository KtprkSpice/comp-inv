import { Plus, X } from "@boxicons/react";
import { useState } from "react";

export default function CreateEmployeeModal({
  isOpen,
  DIVISIONS,
  setIsCreateModalOpen,
  onCreated,
}) {
  const [createFormData, setCreateFormData] = useState({
    fullname: "",
    phone: "",
    division_id: 1,
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (createFormData.password.length < 8) {
      alert("Kata sandi wajib minimal 8 karakter.");
      return;
    }

    const payload = {
      fullname: createFormData.fullname.trim(),
      phone: createFormData.phone.trim(),
      division_id: Number(createFormData.division_id),
      email: createFormData.email.trim(),
      password: createFormData.password,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/employee/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Gagal membuat karyawan",
        );
      }

      // Ambil ulang daftar terbaru dari API setelah create berhasil.
      await onCreated();

      setIsCreateModalOpen(false);
      setCreateFormData({
        fullname: "",
        phone: "",
        division_id: 1,
        email: "",
        password: "",
      });
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
              <Plus />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Karyawan Baru
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formulir pendaftaran staf &amp; akun portal inventaris
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Nama Lengkap (Fullname) *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={createFormData.fullname}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  fullname: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Email Perusahaan *
              </label>
              <input
                type="email"
                required
                placeholder="nama@perusahaan.com"
                value={createFormData.email}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Nomor Telepon / WA *
              </label>
              <input
                type="text"
                required
                placeholder="0812-3456-7890"
                value={createFormData.phone}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    phone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Divisi (DivisionID) *
            </label>
            <select
              value={createFormData.division_id}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  division_id: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {DIVISIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Kata Sandi Awal (Password min. 8 karakter) *
            </label>
            <input
              type="password"
              required
              placeholder="Min. 8 karakter"
              value={createFormData.password}
              onChange={(e) =>
                setCreateFormData({
                  ...createFormData,
                  password: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer"
            >
              Simpan &amp; Buat Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
