import { Edit, X } from "@boxicons/react";
import { useState, useEffect } from "react";

export default function EditEmployeeModal({
  isOpen,
  employee,
  DIVISIONS,
  setIsEditModalOpen,
  onUpdate,
}) {
  const [editFormData, setEditFormData] = useState({
    fullname: "",
    phone: "",
    division_id: 1,
    status: "active",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!isOpen || !employee) return;

    setEditFormData({
      fullname: employee.fullname ?? "",
      phone: employee.phone ?? "",
      division_id: employee.division_id ?? 1,
      status: employee.status ?? "active",
      email: employee.email ?? "",
      password: "",
    });
  }, [isOpen, employee]);

  if (!isOpen || !employee) return null;

  // Submit Update Employee (UpdateEmployeeRequest)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (editFormData.password.length < 8) {
      alert("Kata sandi harus minimal 8 karakter sesuai aturan backend.");
      return;
    }

    const payload = {
      fullname: editFormData.fullname.trim(),
      phone: editFormData.phone.trim(),
      division_id: Number(editFormData.division_id),
      status: editFormData.status,
      email: editFormData.email.trim(),
      password: editFormData.password,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/employee/${employee.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Gagal memperbarui karyawan",
        );
      }

      await onUpdate();
      setIsEditModalOpen(false);
    } catch (error) {
      alert(error.message || "Gagal memperbarui karyawan");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Edit />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Update Data Karyawan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sesuai skema payload backend: UpdateEmployeeRequest
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X onClick={() => setIsEditModalOpen(false)} />
          </button>
        </div>

        <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
          {/* Fullname */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Nama Lengkap (Fullname) *
            </label>
            <input
              type="text"
              required
              value={editFormData.fullname}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  fullname: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Email Perusahaan *
              </label>
              <input
                type="email"
                required
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Nomor Telepon (Phone) *
              </label>
              <input
                type="text"
                required
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    phone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* DivisionID & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Divisi (DivisionID uint) *
              </label>
              <select
                value={editFormData.division_id}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
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
                Status Akun (Status) *
              </label>
              <select
                value={editFormData.status}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    status: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="active">active (Akun Aktif)</option>
                <option value="inactive">inactive (Nonaktif)</option>
              </select>
            </div>
          </div>

          {/* Password Baru (min=8) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Kata Sandi (wajib, minimal 8 karakter sesuai backend)
            </label>
            <input
              type="password"
              minLength={8}
              required
              value={editFormData.password}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  password: e.target.value,
                })
              }
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
