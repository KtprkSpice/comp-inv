export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-white/80 backdrop-blur-sm mt-auto py-4 px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        {/* Brand & System Status */}
        <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <i className="bx bx-package text-base text-slate-900"></i>
            <span>Company Inventory</span>
          </div>
          <span className="text-slate-300">•</span>
          <span>&copy; {currentYear} All rights reserved.</span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational v1.0.0
          </span>
        </div>

        {/* Universal Secondary Links */}
        <nav className="flex items-center gap-5 text-slate-600">
          <a
            href="#help"
            className="hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <i className="bx bx-help-circle text-sm"></i>
            Bantuan
          </a>
          <a
            href="#privacy"
            className="hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <i className="bx bx-shield-quarter text-sm"></i>
            Privasi
          </a>
          <a
            href="#terms"
            className="hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <i className="bx bx-file-blank text-sm"></i>
            Ketentuan
          </a>
        </nav>
      </div>
    </footer>
  );
}
