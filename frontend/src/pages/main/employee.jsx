import React, { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import {
  ArrowInUpSquareHalf,
  CheckCircle,
  CheckShield,
  DotsVertical,
  Edit,
  Group,
  Key,
  PieChart,
  Plus,
  RotateCcw,
  RotateCw,
  Search,
  Sitemap,
  Trash,
  UserCheck,
  UserX,
  X,
} from "@boxicons/react";
import CreateEmployeeModal from "../../components/EmployeeModal/createEmployeeModal";
import EditEmployeeModal from "../../components/EmployeeModal/editEmployeeModal";
import DataTable from "../../components/dataTable";

// Daftar divisi sesuai pemetaan DivisionID (uint)
export const DIVISIONS = [
  { id: 2, name: "Divisi 1 • IT & Infrastructure", color: "blue" },
  { id: 3, name: "Divisi 2 • Logistik & Gudang", color: "indigo" },
  { id: 4, name: "Divisi 3 • Operasional & Pengadaan", color: "emerald" },
  { id: 5, name: "Divisi 4 • Keuangan & Akuntansi", color: "amber" },
  { id: 6, name: "Divisi 5 • Human Resources", color: "purple" },
  { id: 7, name: "Divisi 6 • Legal & Compliance", color: "slate" },
  { id: 8, name: "Divisi 7 • Fasilitas & Keamanan", color: "cyan" },
  { id: 9, name: "Divisi 8 • General Affairs", color: "rose" },
];

// Mock data awal diselaraskan dengan Go struct UpdateEmployeeRequest

export default function Employees({ activeMenu = "Karyawan" }) {
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

  // 2. Data Karyawan & Filter State
  const [employees, setEmployees] = useState([]);
  const [useMockData, setUseMockData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // 4. Modal State (Create Employee)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadEmployees = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/employee/get");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Gagal memuat karyawan",
        );
      }

      const employeeList = (result.data ?? []).map((item) => ({
        id: item.id,
        fullname: item.fullname ?? "",
        email: item.user?.email ?? "",
        phone: item.phone ?? "",
        division_id: item.division_id,
        status: item.status,
        password_hash_info: "Sandi Terproteksi",
      }));

      setEmployees(employeeList);
      setUseMockData(false);
    } catch (error) {
      console.error("Gagal memuat database karyawan:", error);
      setUseMockData(true);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadEmployees().catch(() => {});
  }, [loadEmployees]);

  // Deelte Employee
  async function deleteEmployee(employee) {
    if (!employee?.id) {
      console.error("id tidak ditemukan", employee);
      return;
    }
    const confirmed = window.confirm(`hapus data "${employee.fullname}"?`);

    if (!confirmed) return;

    const res = await fetch(
      `http://localhost:8080/api/employee/${employee.id}`,
      {
        method: "DELETE",
      },
    );
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || result.message || "Error");
    }

    await loadEmployees();
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter Data
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(emp.id).toLowerCase().includes(searchQuery.toLowerCase());

      const matchDivision =
        selectedDivision === "ALL" ||
        emp.division_id === Number(selectedDivision);

      const matchStatus =
        selectedStatus === "ALL" || emp.status === selectedStatus;

      return matchSearch && matchDivision && matchStatus;
    });
  }, [employees, searchQuery, selectedDivision, selectedStatus]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const pageStartIndex = (currentPage - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(
    pageStartIndex,
    pageStartIndex + pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDivision, selectedStatus]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Metrik Statistik Karyawan
  const metrics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "active").length;
    const inactive = total - active;
    const activeRatio = total > 0 ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, activeRatio };
  }, [employees]);

  // Helper Divisi
  const employeeCol = [
    {
      key: "fullname",
      header: "Karyawan & Kontak",
      className: "py-4 px-4 max-w-sm",
      render: (emp) => {
        const initials = emp.fullname
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                {emp.fullname}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <i className="bx bx-envelope text-xs"></i>
                  {emp.email}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <i className="bx bx-phone text-xs"></i>
                  {emp.phone}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "division_id",
      header: "Divisi (DivisionID)",
      className: "py-4 px-4 whitespace-nowrap",
      render: (emp) => {
        const division = DIVISIONS.find((item) => item.id === emp.division_id);
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {division?.name ?? "Belum ditentukan"}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status Akun",
      className: "py-4 px-4 whitespace-nowrap",
      render: (emp) =>
        emp.status === "active" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Inactive
          </span>
        ),
    },
    {
      key: "credentials",
      header: "Credentials Keamanan",
      className: "py-4 px-4 whitespace-nowrap",
      render: (emp) => (
        <div className="flex items-center gap-2">
          <CheckShield />
          <div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
              {(emp.password_hash_info ?? "Sandi Terproteksi").split("•")[0]}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {(emp.password_hash_info ?? "Sandi Terproteksi").split("•")[1] ||
                "Sandi Terproteksi"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "py-4 px-4 text-center whitespace-nowrap",
      render: (emp) => (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => {
              setEditingEmployee(emp);
              setIsEditModalOpen(true);
            }}
            title="Edit Data / UpdateEmployeeRequest"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Edit />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingEmployee(emp);
              setIsEditModalOpen(true);
            }}
            title="Ganti Password"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Key />
          </button>
          <button
            type="button"
            onClick={() => deleteEmployee(emp)}
            title="Menu Opsi"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Trash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Navigasi Universal */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        activeMenu="Karyawan"
      />

      {/* Konten Utama */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Breadcrumb & Judul Halaman */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-900 text-[11px] font-semibold text-blue-700 dark:text-blue-300 mb-2">
              <CheckShield />
              <span>
                HUMAN CAPITAL &amp; ACCESS CONTROL • DIVISION ID SCHEMA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Data Karyawan &amp; Akun Staff
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Kelola direktori profil pegawai, kontak terverifikasi, penugasan
              divisi operasional, dan otorisasi kredensial login portal
              inventaris perusahaan.
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() =>
                alert("Fitur Ekspor CSV Karyawan siap diintegrasikan!")
              }
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ArrowInUpSquareHalf />
              <span>Ekspor CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus />
              <span>Tambah Karyawan Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Kartu Metrik Ringkasan Karyawan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Total Karyawan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Karyawan
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Group />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metrics.total}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                +6 bln ini
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-4/5"></div>
            </div>
          </div>

          {/* Card 2: Akun Aktif */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Akun Aktif
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metrics.active}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {metrics.activeRatio}% Rasio
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Status otentikasi siap kerja
            </p>
          </div>

          {/* Card 3: Akun Nonaktif */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Akun Nonaktif
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <UserX />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {metrics.inactive}
              </span>
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                Perlu Review
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Cuti &amp; Masa Transisi Penugasan
            </p>
          </div>

          {/* Card 4: Total Divisi */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Divisi
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Sitemap />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {DIVISIONS.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                DivisionID: 1-8
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
              <CheckShield />
              Role RBAC Terdefinisi
            </p>
          </div>
        </div>

        {/* Bar Distribusi Personel per Divisi */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 mb-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PieChart />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Distribusi Personel per Divisi
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Alokasi operasional inventaris terdistribusi di seluruh lini
                cabang dan pergudangan.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              IT &amp; Infr. (28)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Gudang &amp; Logistik (42)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Operasional (31)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Keuangan (15)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              HR (12)
            </span>
          </div>
        </div>

        {/* Toolbar Filter & Pencarian */}
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
                placeholder="Cari nama lengkap (fullname), email, nomor telepon..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition-all"
              />
            </div>

            {/* Dropdown Filter Divisi & Status */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              {/* Filter DivisionID */}
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-1/2 md:w-48 py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Divisi (DivisionID)</option>
                {DIVISIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Filter models.Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-1/2 md:w-44 py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Status (Status)</option>
                <option value="active">Active (Aktif)</option>
                <option value="inactive">Inactive (Nonaktif)</option>
              </select>

              {/* Reset Filter Button */}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDivision("ALL");
                  setSelectedStatus("ALL");
                }}
                title="Reset Filter"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
              >
                <RotateCw />
              </button>
            </div>
          </div>

          {/* Status Baris Info */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Terhubung ke Postgres Cluster • Sinkronisasi Data Pegawai:{" "}
              <strong>Realtime</strong>
            </span>
            <span>
              Menampilkan <strong>{filteredEmployees.length}</strong> entitas
              pegawai
            </span>
          </div>
        </div>

        {/* Tabel Data Karyawan (Sesuai Skema UpdateEmployeeRequest) */}
        <DataTable
          columns={employeeCol}
          data={paginatedEmployees}
          totalRows={filteredEmployees.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          emptyMessage="Tidak ada karyawan yang cocok dengan kriteria filter Anda."
        />
      </main>

      {/* MODAL 1: Update Employee (Sesuai struct UpdateEmployeeRequest) */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        employee={editingEmployee}
        DIVISIONS={DIVISIONS}
        setIsEditModalOpen={setIsEditModalOpen}
        onUpdate={loadEmployees}
      />

      {/* MODAL 2: Create Employee Baru */}
      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        DIVISIONS={DIVISIONS}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onCreated={loadEmployees}
      />

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
