import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import {
  ArrowInUpSquareHalf,
  ArrowLeft,
  ArrowRight,
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
  UserCheck,
  UserX,
  X,
} from "@boxicons/react";

// Daftar divisi sesuai pemetaan DivisionID (uint)
export const DIVISIONS = [
  { id: 1, name: "Divisi 1 • IT & Infrastructure", color: "blue" },
  { id: 2, name: "Divisi 2 • Logistik & Gudang", color: "indigo" },
  { id: 3, name: "Divisi 3 • Operasional & Pengadaan", color: "emerald" },
  { id: 4, name: "Divisi 4 • Keuangan & Akuntansi", color: "amber" },
  { id: 5, name: "Divisi 5 • Human Resources", color: "purple" },
  { id: 6, name: "Divisi 6 • Legal & Compliance", color: "slate" },
  { id: 7, name: "Divisi 7 • Fasilitas & Keamanan", color: "cyan" },
  { id: 8, name: "Divisi 8 • General Affairs", color: "rose" },
];

// Mock data awal diselaraskan dengan Go struct UpdateEmployeeRequest
const INITIAL_EMPLOYEES = [
  {
    id: "EMP-0101",
    fullname: "Budi Santoso",
    email: "budi.santoso@perusahaan.com",
    phone: "0812-3456-7890",
    division_id: 1,
    status: "active", // 'active' | 'inactive'
    password_hash_info: "Bcrypt Hash Valid • Diganti 14 hari lalu",
  },
  {
    id: "EMP-0204",
    fullname: "Siti Rahmawati",
    email: "siti.rahma@perusahaan.com",
    phone: "0813-9876-5432",
    division_id: 2,
    status: "active",
    password_hash_info: "Bcrypt Hash Valid • Diganti 32 hari lalu",
  },
  {
    id: "EMP-0312",
    fullname: "Dimas Pratama",
    email: "dimas.pratama@perusahaan.com",
    phone: "0857-1122-3344",
    division_id: 3,
    status: "active",
    password_hash_info: "Bcrypt Hash Valid • Diganti 5 hari lalu",
  },
  {
    id: "EMP-0402",
    fullname: "Anita Kusuma",
    email: "anita.kusuma@perusahaan.com",
    phone: "0878-5566-7788",
    division_id: 4,
    status: "active",
    password_hash_info: "Argon2 Hash Valid • Diganti 21 hari lalu",
  },
  {
    id: "EMP-0501",
    fullname: "Hendra Wijaya",
    email: "hendra.wijaya@perusahaan.com",
    phone: "0821-4433-2211",
    division_id: 5,
    status: "inactive",
    password_hash_info: "Akses Dinonaktifkan • Cuti Operasional",
  },
  {
    id: "EMP-0215",
    fullname: "Rian Febrian",
    email: "rian.febrian@perusahaan.com",
    phone: "0852-7788-9900",
    division_id: 2,
    status: "active",
    password_hash_info: "Bcrypt Hash Valid • Diganti 8 hari lalu",
  },
  {
    id: "EMP-0108",
    fullname: "Maya Anggraini",
    email: "maya.anggraini@perusahaan.com",
    phone: "0819-3322-1144",
    division_id: 1,
    status: "active",
    password_hash_info: "Bcrypt Hash Valid • Diganti 40 hari lalu",
  },
  {
    id: "EMP-0320",
    fullname: "Fajar Setiawan",
    email: "fajar.setiawan@perusahaan.com",
    phone: "0838-9988-7766",
    division_id: 3,
    status: "inactive",
    password_hash_info: "Akses Ditangguhkan • Menunggu Verifikasi Mutasi",
  },
];

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
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // 3. Modal State (Update / Edit Employee)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullname: "",
    phone: "",
    division_id: 1,
    status: "active",
    email: "",
    password: "",
  });

  // 4. Modal State (Create Employee)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    fullname: "",
    phone: "",
    division_id: 1,
    email: "",
    password: "",
  });

  // Inisialisasi form edit
  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setEditFormData({
      fullname: emp.fullname,
      phone: emp.phone,
      division_id: emp.division_id,
      status: emp.status,
      email: emp.email,
      password: "", // Opsional ganti sandi baru (min 8 karakter)
    });
    setIsEditModalOpen(true);
  };

  // Submit Update Employee (UpdateEmployeeRequest)
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (editFormData.password && editFormData.password.length < 8) {
      alert("Kata sandi harus minimal 8 karakter sesuai aturan backend.");
      return;
    }

    setEmployees((prev) =>
      prev.map((item) => {
        if (item.id === editingEmployee.id) {
          return {
            ...item,
            fullname: editFormData.fullname.trim(),
            phone: editFormData.phone.trim(),
            division_id: Number(editFormData.division_id),
            status: editFormData.status,
            email: editFormData.email.trim(),
            password_hash_info: editFormData.password
              ? "Bcrypt Hash Valid • Baru saja diperbarui"
              : item.password_hash_info,
          };
        }
        return item;
      }),
    );

    setIsEditModalOpen(false);
  };

  // Submit Tambah Karyawan Baru
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (createFormData.password.length < 8) {
      alert("Kata sandi wajib minimal 8 karakter.");
      return;
    }

    const newId = `EMP-0${employees.length + 101}`;
    const newEmp = {
      id: newId,
      fullname: createFormData.fullname.trim(),
      email: createFormData.email.trim(),
      phone: createFormData.phone.trim(),
      division_id: Number(createFormData.division_id),
      status: "active",
      password_hash_info: "Bcrypt Hash Valid • Akun baru terdaftar",
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setIsCreateModalOpen(false);
    setCreateFormData({
      fullname: "",
      phone: "",
      division_id: 1,
      email: "",
      password: "",
    });
  };

  // Filter Data
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDivision =
        selectedDivision === "ALL" ||
        emp.division_id === Number(selectedDivision);

      const matchStatus =
        selectedStatus === "ALL" || emp.status === selectedStatus;

      return matchSearch && matchDivision && matchStatus;
    });
  }, [employees, searchQuery, selectedDivision, selectedStatus]);

  // Metrik Statistik Karyawan
  const metrics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "active").length;
    const inactive = total - active;
    const activeRatio = total > 0 ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, activeRatio };
  }, [employees]);

  // Helper Divisi
  const getDivisionObj = (id) =>
    DIVISIONS.find((d) => d.id === id) || DIVISIONS[0];

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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4 sm:px-6">ID / NIK</th>
                  <th className="py-3.5 px-4">Karyawan &amp; Kontak</th>
                  <th className="py-3.5 px-4">Divisi (DivisionID)</th>
                  <th className="py-3.5 px-4">Status Akun</th>
                  <th className="py-3.5 px-4">Kredensial Keamanan</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs sm:text-sm">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-slate-400 dark:text-slate-500"
                    >
                      <i className="bx bx-user-x text-3xl mb-2 block"></i>
                      Tidak ada karyawan yang cocok dengan kriteria filter Anda.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => {
                    const divObj = getDivisionObj(emp.division_id);
                    const initials = emp.fullname
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <tr
                        key={emp.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* ID / NIK */}
                        <td className="py-4 px-4 sm:px-6 font-mono font-semibold text-blue-600 dark:text-blue-400 text-xs">
                          <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/60">
                            {emp.id}
                          </span>
                        </td>

                        {/* Karyawan & Kontak (Fullname, Email, Phone) */}
                        <td className="py-4 px-4 max-w-sm">
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
                        </td>

                        {/* Divisi (DivisionID) */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {divObj.name}
                          </span>
                        </td>

                        {/* Status Akun (models.Status) */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {emp.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Kredensial Keamanan */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <CheckShield />
                            <div>
                              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                                {emp.password_hash_info.split("•")[0]}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                {emp.password_hash_info.split("•")[1] ||
                                  "Sandi Terproteksi"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Tombol Aksi */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(emp)}
                              title="Edit Data / UpdateEmployeeRequest"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Edit />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(emp)}
                              title="Ganti Password"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Key />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                alert(`Opsi tambahan untuk ${emp.fullname}`)
                              }
                              title="Menu Opsi"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <DotsVertical />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Menampilkan baris <strong>1</strong> sampai{" "}
              <strong>{filteredEmployees.length}</strong> dari{" "}
              <strong>128</strong> total entri
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 flex items-center gap-1 text-xs cursor-not-allowed"
              >
                <ArrowLeft />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs flex items-center justify-center shadow-xs"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs flex items-center justify-center transition-colors"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs flex items-center justify-center transition-colors"
              >
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button
                type="button"
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs flex items-center justify-center transition-colors"
              >
                16
              </button>

              <button
                type="button"
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1 text-xs transition-colors cursor-pointer"
              >
                <span>Berikutnya</span>
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: Update Employee (Sesuai struct UpdateEmployeeRequest) */}
      {isEditModalOpen && (
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
                <X />
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
                  Ganti Kata Sandi (Kosongkan jika tidak diubah, min. 8
                  karakter)
                </label>
                <input
                  type="password"
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
      )}

      {/* MODAL 2: Create Employee Baru */}
      {isCreateModalOpen && (
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
      )}

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
