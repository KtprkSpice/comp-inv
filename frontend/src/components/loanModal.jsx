import { Plus, X } from "@boxicons/react";
import { useEffect, useState } from "react";

const EMPTY_FORM = {
  employee_id: "",
  item_id: "",
  amount: 0,
  start_time: "",
  end_time: "",
};

export default function LoanModal({ loan = null, onSave, OnClose }) {
  const isEdit = Boolean(loan);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm({
      employee_id: loan?.employee_id ?? "",
      item_id: loan?.item_id ?? "",
      amount: loan?.amount ?? 0,
      start_time: loan?.start_time ?? "",
      end_time: loan?.end_time ?? "",
    });
  }, [loan]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      employee_id: Number(form.employee_id),
      item_id: Number(form.item_id),
      amount: Number(form.amount),
      start_time: form.start_time,
      end_time: form.end_time,
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
              <Plus />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEdit ? "Edit Peminjaman" : "Buat Peminjaman Baru"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formulir pencatatan transaksi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Employee Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Peminjam (EmployeeID) *
            </label>
            <select
              required
              value={form.employee_id}
              onChange={(e) =>
                setFormData({ ...form, employee_id: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {EMPLOYEES_MOCK.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullname} ({emp.division} - {emp.empCode})
                </option>
              ))}
            </select>
          </div>

          {/* Item Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Barang Inventaris (ItemID) *
            </label>
            <select
              required
              value={formData.item_id}
              onChange={(e) =>
                setFormData({ ...formData, item_id: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {ITEMS_MOCK.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} [{item.sku}] - Tersedia: {item.stockAvailable}{" "}
                  Unit
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Jumlah Unit (Amount) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Waktu Mulai (StartTime) *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Batas Kembali (EndTime) *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span>Preset Durasi:</span>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const end = new Date(Date.now() + 3 * 86400000);
                setFormData({
                  ...formData,
                  start_time: now.toISOString().slice(0, 16),
                  end_time: end.toISOString().slice(0, 16),
                });
              }}
              className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              +3 Hari
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const end = new Date(Date.now() + 7 * 86400000);
                setFormData({
                  ...formData,
                  start_time: now.toISOString().slice(0, 16),
                  end_time: end.toISOString().slice(0, 16),
                });
              }}
              className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              +7 Hari
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const end = new Date(Date.now() + 14 * 86400000);
                setFormData({
                  ...formData,
                  start_time: now.toISOString().slice(0, 16),
                  end_time: end.toISOString().slice(0, 16),
                });
              }}
              className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              +14 Hari
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer"
            >
              Simpan Transaksi Peminjaman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
