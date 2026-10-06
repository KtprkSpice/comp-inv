export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm mt-auto py-4 px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        {/* Brand & Status Operasional */}
        <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <i className="bx bx-package text-base text-slate-900 dark:text-slate-100"></i>
            <span>Company Inventory</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            v1.0.0
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            All systems operational
          </span>
        </div>

        {/* Tautan Universal */}
        <div className="flex flex-wrap items-center gap-5 justify-center">
          <nav className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <a
              href="#help"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Help Center
            </a>
            <a
              href="#privacy"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </nav>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">
            |
          </span>
          <p className="text-slate-400 dark:text-slate-500">
            &copy; {currentYear} Company Inventory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
