import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import DataTable from "../../components/dataTable";
import {
  AlertTriangle,
  Archive,
  ArrowInLeftSquareHalf,
  ArrowInUpSquareHalf,
  ArrowRightLeft,
  ArrowToBottom,
  Check,
  DotsVertical,
  Eye,
  Hourglass,
  Plus,
  Receipt,
  RefreshCcw,
  RotateCw,
  Search,
} from "@boxicons/react";
// Data Mock Master Karyawan untuk Relasi Employee
const EMPLOYEES_MOCK = [
  {
    id: 101,
    fullname: "Budi Santoso",
    email: "budi.santoso@company.co.id",
    division: "IT Support",
    empCode: "EMP-0881",
  },
  {
    id: 102,
    fullname: "Siti Rahma",
    email: "siti.rahma@company.co.id",
    division: "Logistik Warehouse",
    empCode: "EMP-0219",
  },
  {
    id: 103,
    fullname: "Dimas Anggara",
    email: "dimas.a@company.co.id",
    division: "Creative Media",
    empCode: "EMP-0450",
  },
  {
    id: 104,
    fullname: "Anisa Putri",
    email: "anisa.putri@company.co.id",
    division: "HR People Ops",
    empCode: "EMP-0112",
  },
  {
    id: 105,
    fullname: "Hendra Wijaya",
    email: "hendra.w@company.co.id",
    division: "Finance",
    empCode: "EMP-0034",
  },
];

// Data Mock Master Barang untuk Relasi Item
const ITEMS_MOCK = [
  {
    id: 501,
    name: "ThinkPad T14s Gen 3",
    sku: "INV-IT-0042",
    category: "Hardware / Laptop",
    stockAvailable: 8,
  },
  {
    id: 502,
    name: "Zebra Barcode Scanner TC21",
    sku: "INV-LOG-0199",
    category: "Perangkat Lapangan",
    stockAvailable: 14,
  },
  {
    id: 503,
    name: "Sony Alpha A7 IV Mirrorless Kit",
    sku: "INV-AV-0012",
    category: "Audio Visual / Kamera",
    stockAvailable: 3,
  },
  {
    id: 504,
    name: "Wireless Mic Boya BY-XM6-S2",
    sku: "INV-AV-0089",
    category: "Audio Visual",
    stockAvailable: 5,
  },
  {
    id: 505,
    name: "Proyektor Epson EB-X500",
    sku: "INV-OF-0031",
    category: "Perlengkapan Rapat",
    stockAvailable: 6,
  },
];

// Data Transaksi Awal Sesuai Go struct LoanDetail
const INITIAL_LOANS = [
  {
    id: 1042,
    refCode: "#LN-2024-001",
    employee_id: 101,
    employee: {
      fullname: "Budi Santoso",
      email: "budi.santoso@company.co.id",
      division: "IT Support",
      empCode: "EMP-0881",
    },
    item_id: 501,
    item: {
      name: "ThinkPad T14s Gen 3",
      sku: "INV-IT-0042",
      category: "Hardware / Laptop",
    },
    amount: 1,
    start_time: "2024-05-10T08:30:00",
    end_time: "2024-05-17T17:00:00",
    durationLabel: "Durasi: 7 Hari",
    dueWarning: "Terlambat 2 Hari",
    status: "Terlambat", // 'Terlambat' | 'Jatuh Tempo Segera' | 'Sedang Berjalan' | 'Dikembalikan'
  },
  {
    id: 1043,
    refCode: "#LN-2024-002",
    employee_id: 102,
    employee: {
      fullname: "Siti Rahma",
      email: "siti.rahma@company.co.id",
      division: "Logistik Warehouse",
      empCode: "EMP-0219",
    },
    item_id: 502,
    item: {
      name: "Zebra Barcode Scanner TC21",
      sku: "INV-LOG-0199",
      category: "Perangkat Lapangan",
    },
    amount: 3,
    start_time: "2024-05-14T09:00:00",
    end_time: "2024-05-20T17:00:00",
    durationLabel: "Batas: 6 Jam Lagi",
    dueWarning: "Jatuh Tempo Hari Ini",
    status: "Jatuh Tempo Segera",
  },
  {
    id: 1044,
    refCode: "#LN-2024-003",
    employee_id: 103,
    employee: {
      fullname: "Dimas Anggara",
      email: "dimas.a@company.co.id",
      division: "Creative Media",
      empCode: "EMP-0450",
    },
    item_id: 503,
    item: {
      name: "Sony Alpha A7 IV Mirrorless Kit",
      sku: "INV-AV-0012",
      category: "Audio Visual / Kamera",
    },
    amount: 1,
    start_time: "2024-05-16T10:00:00",
    end_time: "2024-05-22T18:00:00",
    durationLabel: "Durasi: 6 Hari",
    dueWarning: "Tersisa 4 Hari",
    status: "Sedang Berjalan",
  },
  {
    id: 1045,
    refCode: "#LN-2024-004",
    employee_id: 104,
    employee: {
      fullname: "Anisa Putri",
      email: "anisa.putri@company.co.id",
      division: "HR People Ops",
      empCode: "EMP-0112",
    },
    item_id: 504,
    item: {
      name: "Wireless Mic Boya BY-XM6-S2",
      sku: "INV-AV-0089",
      category: "Audio Visual",
    },
    amount: 2,
    start_time: "2024-05-17T08:00:00",
    end_time: "2024-05-24T17:00:00",
    durationLabel: "Durasi: 7 Hari",
    dueWarning: "Tersisa 6 Hari",
    status: "Sedang Berjalan",
  },
  {
    id: 1041,
    refCode: "#LN-2024-000",
    employee_id: 105,
    employee: {
      fullname: "Hendra Wijaya",
      email: "hendra.w@company.co.id",
      division: "Finance",
      empCode: "EMP-0034",
    },
    item_id: 505,
    item: {
      name: "Proyektor Epson EB-X500",
      sku: "INV-OF-0031",
      category: "Perlengkapan Rapat",
    },
    amount: 1,
    start_time: "2024-05-02T09:00:00",
    end_time: "2024-05-05T17:00:00",
    durationLabel: "Diterima oleh Admin Gudang (Audit OK)",
    dueWarning: "Selesai Tepat Waktu",
    status: "Dikembalikan",
  },
];

export default function LoanManagement() {
  // 1. Dark Mode State & LocalStorage
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // 2. Data State & Filter
  const [loans, setLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [selectedDivision, setSelectedDivision] = useState("Semua Divisi");

  // 3. Modal Form State (Buat Peminjaman Baru)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: 101,
    item_id: 501,
    amount: 1,
    start_time: "",
    end_time: "",
    note: "",
  });

  // Get Loans Data
  const loadLoans = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/loan/get`);
      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || "Gagal memuat data");
      }

      const now = new Date();
      const loanList = (res.data ?? []).map((loan) => {
        const endTime = new Date(loan.end_time);
        let status;

        if (loan.status === "Dikembalikan") {
          status = "Dikembalikan";
        } else if (endTime < now) {
          status = "Terlambat";
        } else {
          status = "Jatuh Tempo Segera";
        }

        return {
          id: loan.id,
          employee_id: loan.employee_id ?? null,
          employee: loan.employee ?? null,
          item_id: loan.item_id ?? null,
          item: loan.item ?? null,
          amount: loan.amount ?? null,
          start_time: loan.start_time ?? null,
          end_time: loan.end_time ?? null,
          status,
        };
      });

      setLoans(loanList);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  }, []);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  // 4. Kalkulasi 4 Metrik Ringkasan
  const metrics = useMemo(() => {
    const activeLoans = loans.filter((loan) => loan.status !== "Dikembalikan");

    const today = new Date();
    const dueToday = activeLoans.filter((loan) => {
      if (!loan.end_time) return false;

      const endDate = new Date(loan.end_time);

      return (
        endDate.getFullYear() === today.getFullYear() &&
        endDate.getMonth() === today.getMonth() &&
        endDate.getDate() === today.getDate()
      );
    }).length;

    const overdue = activeLoans.filter(
      (loan) => loan.status === "Terlambat",
    ).length;

    const totalUnits = activeLoans.reduce(
      (sum, loan) => sum + (Number(loan.amount) || 0),
      0,
    );

    return {
      activeLoans: activeLoans.length,
      dueToday,
      overdue,
      totalUnits,
    };
  }, [loans]);

  // 5. Filter Data
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const query = searchQuery.toLowerCase();

      const employeeName = loan.employee?.fullname ?? "";
      const itemName = loan.item?.name ?? "";
      const itemSku = loan.item?.sku ?? "";
      const refCode = loan.refCode ?? "";

      const matchSearch =
        employeeName.toLowerCase().includes(query) ||
        itemName.toLowerCase().includes(query) ||
        itemSku.toLowerCase().includes(query) ||
        refCode.toLowerCase().includes(query) ||
        String(loan.id ?? "").includes(query);

      const division = loan.employee?.division?.name ?? "";
      const matchDivision =
        selectedDivision === "Semua Divisi" ||
        division.toLowerCase().includes(selectedDivision.toLowerCase());

      const matchStatus =
        selectedStatus === "Semua Status" || loan.status === selectedStatus;

      return matchSearch && matchStatus && matchDivision;
    });
  }, [loans, searchQuery, selectedStatus, selectedDivision]);

  // 6. Reset Filter
  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedStatus("Semua Status");
    setSelectedDivision("Semua Divisi");
  };

  // 7. Submit Buat Peminjaman Baru (LoanDetail Request)
  const handleCreateLoan = (e) => {
    e.preventDefault();
    const selectedEmp =
      EMPLOYEES_MOCK.find((e) => e.id === Number(formData.employee_id)) ||
      EMPLOYEES_MOCK[0];
    const selectedItem =
      ITEMS_MOCK.find((i) => i.id === Number(formData.item_id)) ||
      ITEMS_MOCK[0];

    const newId = Date.now().toString().slice(-4);
    const newLoan = {
      id: Number(newId),
      refCode: `#LN-2024-00${loans.length + 1}`,
      employee_id: selectedEmp.id,
      employee: {
        fullname: selectedEmp.fullname,
        email: selectedEmp.email,
        division: selectedEmp.division,
        empCode: selectedEmp.empCode,
      },
      item_id: selectedItem.id,
      item: {
        name: selectedItem.name,
        sku: selectedItem.sku,
        category: selectedItem.category,
      },
      amount: Number(formData.amount) || 1,
      start_time: formData.start_time || new Date().toISOString(),
      end_time:
        formData.end_time || new Date(Date.now() + 7 * 86400000).toISOString(),
      durationLabel: "Durasi: 7 Hari",
      dueWarning: "Tersisa 7 Hari",
      status: "Sedang Berjalan",
    };

    setLoans((prev) => [newLoan, ...prev]);
    setIsModalOpen(false);
  };

  // Format Helper Tanggal
  const formatDateTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Col
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const paginatedItems = filteredLoans.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const col = [
    {
      key: "employee",
      header: "Peminjam (Employee)",
      className: "py-3.5 px-4 sm:px-6",
      render: (loan) => {
        const employee = loan.employee ?? {};
        const employeeName = employee.fullname ?? "Karyawan tidak ditemukan";
        const division =
          typeof employee.division === "string"
            ? employee.division
            : (employee.division?.name ?? "—");
        const initials = employeeName
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                {employeeName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {employee.email ?? employee.user?.email ?? "—"}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {division}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {employee.empCode ??
                    employee.employee_code ??
                    `ID ${loan.employee_id ?? "—"}`}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "item",
      header: "Barang Inventaris (item)",
      className: "py-3.5 px-4",
      render: (loan) => {
        const item = loan.item ?? {};
        return (
          <>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">
              {item.name ?? "Barang tidak ditemukan"}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
              {item.sku ?? `ID ${loan.item_id ?? "—"}`}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60">
              {item.category ?? "—"}
            </span>
          </>
        );
      },
    },
    {
      key: "amount",
      header: "amount",
      className: "py-3.5 px-4",
      render: (loan) => (
        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 font-mono text-center">
          {loan.amount} Unit
        </span>
      ),
    },
    {
      key: "loan_time",
      header: "Periode Peminjaman",
      className: "py-3.5 px-4",
      render: (loan) => (
        <div className="flex items-start gap-2">
          <i className="bx bx-time text-sm text-slate-400 mt-0.5"></i>
          <div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {formatDateTime(loan.start_time)} &rarr;{" "}
              {formatDateTime(loan.end_time)}
            </p>

            {/* Alert Label Waktu */}
            <div className="flex items-center gap-2 mt-1">
              {loan.status === "Terlambat" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                  <i className="bx bx-error-circle text-xs"></i>
                  {loan.dueWarning}
                </span>
              )}
              {loan.status === "Jatuh Tempo Segera" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
                  <i className="bx bx-hourglass text-xs"></i>
                  {loan.dueWarning}
                </span>
              )}
              {loan.status === "Sedang Berjalan" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded font-medium">
                  {loan.dueWarning}
                </span>
              )}
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {loan.durationLabel}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "status",
      className: "py-3.5 px-4",
      render: (loan) => {
        if (loan.status === "Terlambat") {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Terlambat
            </span>
          );
        }
        if (loan.status === "Jatuh Tempo Segera") {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Jatuh Tempo Segera
            </span>
          );
        }
        if (loan.status === "Sedang Berjalan") {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Sedang Berjalan
            </span>
          );
        }
        if (loan.status === "Dikembalikan") {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Dikembalikan
            </span>
          );
        }
      },
    },
    {
      key: "aksi",
      header: "aski",
      className: "py-3.5 px-4 text-center",
      render: (loan) => (
        <div className="flex items-center justify-center gap-1.5">
          {loan.status === "Terlambat" && (
            <button
              type="button"
              onClick={() =>
                alert(`Proses pengembalian darurat untuk ${loan.refCode}`)
              }
              className="px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowInLeftSquareHalf size="sm" />
              <span>Kembalikan</span>
            </button>
          )}

          {loan.status === "Jatuh Tempo Segera" && (
            <button
              type="button"
              onClick={() =>
                alert(`Proses serah terima barang ${loan.refCode}`)
              }
              className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Check size="sm" />
              <span>Proses Terima</span>
            </button>
          )}

          {loan.status === "Sedang Berjalan" && (
            <button
              type="button"
              onClick={() => alert(`Lihat detail peminjaman ${loan.refCode}`)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Eye size="sm" />
              <span>Detail</span>
            </button>
          )}

          {loan.status === "Dikembalikan" && (
            <button
              type="button"
              onClick={() =>
                alert(`Cetak kwitansi pengembalian ${loan.refCode}`)
              }
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Receipt size="sm" />
              <span>Kwitansi</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              alert(`Menu opsi lainnya untuk transaksi ${loan.refCode}`)
            }
            title="Opsi Lainnya"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <DotsVertical />
          </button>
        </div>
      ),
    },
  ];
  // End Col

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Navigasi Universal */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        activeMenu="Peminjaman"
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-900 text-[11px] font-semibold text-blue-700 dark:text-blue-300 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              <span>
                LOGISTICS &amp; ASSET CONTROL • LOAN TRANSACTION SCHEMA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Peminjaman Barang &amp; Aset Kantor
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Kelola riwayat peminjaman aset perusahaan oleh karyawan, pantau
              durasi peminjaman (<strong>StartTime - EndTime</strong>), jumlah
              unit (<strong>Amount</strong>), serta status pengembalian
              inventaris secara terpusat.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() =>
                alert(
                  "Fitur Ekspor Laporan Peminjaman (PDF/Excel) siap diintegrasikan!",
                )
              }
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ArrowInUpSquareHalf />
              <span>Ekspor Laporan</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus />
              <span>Buat Peminjaman Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Kartu Metrik Ringkasan Peminjaman */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Sedang Dipinjam */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Sedang Dipinjam
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ArrowRightLeft />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metrics.activeLoans}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Transaksi
              </span>
            </div>
            <div className="mt-4">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full w-[72%]"></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span>72% dari kuota operasional</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  +3 hari ini
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Jatuh Tempo Hari Ini */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Jatuh Tempo Hari Ini
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Hourglass />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metrics.dueToday}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Peminjaman
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Perlu Pengembalian
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Batas jam 17:00
              </span>
            </div>
          </div>

          {/* Card 3: Terlambat (Overdue) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Terlambat (Overdue)
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertTriangle />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                {metrics.overdue}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Transaksi
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200/70 dark:border-rose-900/60">
                Audit Diperlukan
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-medium">
                Auto-notifikasi terkirim
              </span>
            </div>
          </div>

          {/* Card 4: Total Unit Dipinjam */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Unit Dipinjam
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Archive />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metrics.totalUnits}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Unit
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Terdistribusi 18 Divisi</span>
              <span className="font-mono font-semibold">
                Σ Amount: {metrics.totalUnits}
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar Pencarian & Filter */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 mb-4 shadow-2xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Input Live Search */}
            <div className="relative w-full md:flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari peminjam (Employee), nama barang (Item), atau ID Transaksi..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition-all"
              />
            </div>

            {/* Dropdown Filter Status & Divisi */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-1/2 md:w-48 py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Semua Status">Status: Semua Status</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
                <option value="Jatuh Tempo Segera">Jatuh Tempo Segera</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Dikembalikan">Dikembalikan</option>
              </select>

              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-1/2 md:w-44 py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Semua Divisi">Semua Divisi</option>
                <option value="IT Support">IT Support</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Creative Media">Creative Media</option>
                <option value="HR People Ops">HR People Ops</option>
                <option value="Finance">Finance</option>
              </select>

              {/* Reset Filter Button */}
              <button
                type="button"
                onClick={handleResetFilter}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer shrink-0"
              >
                <RotateCw />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Sinkronisasi database dengan tabel LoanDetail berhasil!",
                  )
                }
                title="Refresh Sinkronisasi"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shrink-0"
              >
                <RefreshCcw />
              </button>
            </div>
          </div>

          {/* Baris Status & Sinkronisasi GORM */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              Menampilkan <strong>{filteredLoans.length}</strong> dari{" "}
              <strong>24</strong> entri transaksi peminjaman aktif
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
              Sinkronisasi Database Go-ORM: GORM model: LoanDetail
              (AutoMigrated)
            </span>
          </div>
        </div>

        {/* Tabel Data Peminjaman Barang & Inventaris */}
        <DataTable
          columns={col}
          data={paginatedItems}
          totalRows={filteredLoans.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          emptyMessage="Tidak ada peminjaman yang cocok dengan kriteria filter Anda."
        />
      </main>

      {/* Modal Dialog: Buat Peminjaman Baru (LoanDetail Request) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">
                  <i className="bx bx-plus text-lg"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Buat Peminjaman Baru
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Formulir pencatatan transaksi aset sesuai struct LoanDetail
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleCreateLoan} className="space-y-4 mt-4">
              {/* Employee Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Peminjam (EmployeeID) *
                </label>
                <select
                  required
                  value={formData.employee_id}
                  onChange={(e) =>
                    setFormData({ ...formData, employee_id: e.target.value })
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
      )}

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
