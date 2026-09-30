import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useEffect, useState } from "react";
import { ArrowRight, Box, ChartLine, Warehouse } from "@boxicons/react";

export default function Dashboard() {
  // 1. Mengambil preferensi tema awal dari localStorage atau preferensi OS pengguna
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 2. Efek untuk mengaplikasikan class 'dark' ke tag <html> dan menyimpannya di localStorage
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

  // Handler toggle mode
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Navigasi */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        activeMenu="Dashboard"
      />

      {/* Konten Utama Dashboard */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Main Card Selamat Datang */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-8 sm:p-14 text-center relative overflow-hidden transition-all">
            {/* Top Glow Accent Subtle */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>

            {/* Badge Status Sesi */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Admin Session Aktif • Node 01
            </div>

            {/* Icon Box Utama */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-center text-slate-800 dark:text-slate-100 mb-6 shadow-xs">
              <Warehouse />
            </div>

            {/* Pesan Selamat Datang */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
              Selamat Datang di Company Inventory
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-10">
              Sistem Manajemen Inventaris Perusahaan Anda siap digunakan.
              Silakan pilih menu di navigasi atas untuk mulai mengelola data
              barang.
            </p>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-8 text-left">
              <a
                href="#inventory"
                className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <Box />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Data Barang
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Kelola inventaris fisik
                  </p>
                </div>
                <ArrowRight />
              </a>

              <a
                href="#reports"
                className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                  <ChartLine />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Laporan Berkala
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Ringkasan status stok
                  </p>
                </div>
                <ArrowRight />
              </a>
            </div>

            {/* Info Security Footer Card */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
              <i className="bx bx-lock-alt text-sm"></i>
              <span>Koneksi terenkripsi • Hak Akses: Administrator</span>
            </div>
          </div>

          {/* Bantuan Eksternal Prompt */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Butuh bantuan konfigurasi? Buka{" "}
            <a
              href="#support"
              className="text-slate-700 dark:text-slate-300 font-semibold underline underline-offset-2 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Pusat Bantuan
            </a>{" "}
            atau hubungi tim IT Internal.
          </p>
        </div>
      </main>

      {/* Footer Universal */}
      <Footer />
    </div>
  );
}
