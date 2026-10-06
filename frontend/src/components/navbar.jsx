import { Moon, Sun, User, Warehouse } from "@boxicons/react";

export default function Navbar({
  isDark,
  onToggleTheme,
  activeMenu = "Dashboard",
}) {
  const menuItems = [
    { name: "Dashboard", href: "/" },
    { name: "Karyawan", href: "/employee" },
    { name: "Barang / Inventaris", href: "/item" },
    { name: "Laporan", href: "#reports" },
    { name: "Pengaturan", href: "#settings" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold">
              <Warehouse />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              Company Inventory
            </span>
          </div>

          {/* Navigasi Utama Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.name;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Theme Toggle & Admin Profile */}
        <div className="flex items-center gap-3">
          {/* Tombol Toggle Dark / Light Mode */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all flex items-center justify-center cursor-pointer shadow-xs"
          >
            {isDark ? <Sun /> : <Moon />}
          </button>

          {/* Pemisah Vertikal */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700"></div>

          {/* Admin Profile Pill */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                Admin
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Operations
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-medium shadow-xs">
              <User />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
