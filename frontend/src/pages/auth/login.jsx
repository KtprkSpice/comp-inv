import { useState } from "react";
import Footer from "../../components/footer";
import { Warehouse } from "@boxicons/react";

export default function Login() {
  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Harap masukkan email dan kata sandi.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(
          data.message ||
            "Kredensial tidak valid. Silakan periksa kembali email dan password.",
        );
      }
    } catch (err) {
      setErrorMessage(
        "Gagal terhubung ke server. Periksa koneksi internet Anda.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff]">
      {/* Kontainer Form Tengah */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[420px]">
          {/* Card Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-10">
            {/* Header / Brand */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#0f172a] text-white mb-4 shadow-sm">
                <Warehouse />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Company Inventory
              </h1>
              <p className="text-sm text-slate-500 mt-1">Masuk ke akun admin</p>
            </div>

            {/* Kotak Pesan Error */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 transition-all"
              >
                <i className="bx bx-error-circle text-base mt-0.5 shrink-0 text-rose-600"></i>
                <span className="leading-relaxed font-medium">
                  {errorMessage}
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Field Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <i className="bx bx-envelope text-lg"></i>
                  </span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mail.com"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Field Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <i className="bx bx-lock-alt text-lg"></i>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    aria-label={
                      showPassword ? "Sembunyikan password" : "Lihat password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none cursor-pointer"
                  >
                    <i
                      className={`bx ${showPassword ? "bx-hide" : "bx-show"} text-lg`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <i className="bx bx-loader-alt animate-spin text-lg"></i>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <i className="bx bx-right-arrow-alt text-lg"></i>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <i className="bx bx-lock-shield text-base text-slate-600"></i>
            <span>
              Sistem Inventaris Perusahaan • Akses Terbatas Administrator
            </span>
          </div>
        </div>
      </main>

      {/* Universal Footer Component */}
      <Footer />
    </div>
  );
}
