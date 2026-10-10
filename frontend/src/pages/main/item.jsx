import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowInUpSquareHalf,
  ArrowLeft,
  ArrowRight,
  CheckShield,
  Container,
  CrossCircle,
  DotsVertical,
  Edit,
  Percentage,
  Plus,
  RefreshCw,
  RotateCw,
  Search,
  Trash,
  Widget,
} from "@boxicons/react";
import DataTable from "../../components/dataTable";
import ItemModal from "../../components/itemModal";
const INITIAL_ITEMS = [
  {
    id: "1",
    sku: "INV-IT-001",
    name: "Laptop ThinkPad T14 Gen 3",
    spec: "Core i7-1260P • 16GB DDR4 • SSD 512GB NVMe • Garansi Resmi Lenovo",
    category: "IT & Hardware",
    stock: 42,
    maxStock: 50,
    status: "Tersedia",
  },
  {
    id: "2",
    sku: "INV-EL-014",
    name: 'Monitor Dell UltraSharp 27" 4K (U2723QE)',
    spec: "IPS Black Tech • USB-C Hub 90W PD • 100% sRGB • DisplayPort 1.4",
    category: "Elektronik",
    stock: 18,
    maxStock: 30,
    status: "Tersedia",
  },
  {
    id: "3",
    sku: "INV-FN-088",
    name: "Kursi Ergonomis Mesh Pro",
    spec: "Lumbar Support Dinamis • 3D Armrest • Gaslift Kelas 4 BIFMA Certified",
    category: "Furnitur Kantor",
    stock: 7,
    maxStock: 25,
    status: "Stok Menipis",
  },
  {
    id: "4",
    sku: "INV-AK-023",
    name: "Keyboard Mekanikal Wireless",
    spec: "Hot-Swappable Red Switch • Bluetooth 5.2 / 2.4GHz • Layout 75% ANSI",
    category: "Aksesoris Komputer",
    stock: 29,
    maxStock: 40,
    status: "Tersedia",
  },
  {
    id: "5",
    sku: "INV-EL-091",
    name: "Proyektor Epson EB-E01",
    spec: "3.300 Lumens • Resolusi XGA • Port HDMI / VGA • Ruang Konferensi Lt. 3",
    category: "Elektronik",
    stock: 0,
    maxStock: 15,
    status: "Habis",
  },
  {
    id: "6",
    sku: "INV-AK-110",
    name: "Kabel HDMI 4K Braided 3M",
    spec: "Ultra High Speed 48Gbps • EARC • Gold Plated Connector • Nylon Braid",
    category: "Aksesoris Komputer",
    stock: 85,
    maxStock: 100,
    status: "Tersedia",
  },
  {
    id: "7",
    sku: "INV-PK-005",
    name: "Printer Canon Pixma G3020",
    spec: "All-in-One Ink Tank • Wi-Fi Direct Print • Scan Flatbed CIS 600x1200",
    category: "Peralatan Kantor",
    stock: 4,
    maxStock: 20,
    status: "Stok Menipis",
  },
  {
    id: "8",
    sku: "INV-FN-012",
    name: "Meja Kerja Adjustable Elektrik",
    spec: "Dual-Motor Sit-Stand Desk 160x80cm • Memory Controller LED • Kabel Tray",
    category: "Furnitur Kantor",
    stock: 12,
    maxStock: 20,
    status: "Tersedia",
  },
];

export default function Inventory() {
  // 1. Theme State (Dark / Light Mode)
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

  // Const
  const toggleTheme = () => setIsDark((prev) => !prev);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");

  // Get Item
  const [items, setItems] = useState([]);

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/item/get");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Gagal memuat item");
      }

      const itemList = (result.data ?? []).map((item) => ({
        id: item.id,
        name: item.name ?? "",
        category: item.category ?? "",
        stock: Number(item.stock ?? 0),
        status:
          Number(item.stock ?? 0) === 0
            ? "Habis"
            : Number(item.stock ?? 0) < 10
              ? "Stok Menipis"
              : "Tersedia",
      }));

      setItems(itemList);
    } catch (error) {
      console.error("Gagal memuat data item:", error);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  //Filter Data
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.stock).includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "Semua Kategori" ||
        item.category === selectedCategory;

      const matchStatus =
        selectedStatus === "Semua Status" || item.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Delete item
  async function delteItem(item) {
    if (!item?.id) {
      console.error("id tidak ditemukan", item);
      return;
    }

    const confirmation = window.confirm(`Hapus data "${item.name}"?`);
    if (!confirmation) return;

    const res = await fetch(`http://localhost:8080/api/item/${item.id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || result.message || "Gagal menghapus data");
    }

    await loadItems();
  }

  // Column
  const col = [
    {
      key: "name",
      header: "Nama Barang & Spesifikasi",
      className: "py-4 px-4 max-w-md",
      render: (item) => {
        const initials = item.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        return (
          <p className="font-semibold text-slate-900 dark:text-white leading-tight">
            {item.name}
          </p>
        );
      },
    },
    {
      key: "category",
      header: "Kategori",
      className: "py-4 px-4 whitespace-nowrap",
      render: (item) => {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60">
            <i className={`${getCategoryIcon(item.category)} text-xs`}></i>
            {item.category}
          </span>
        );
      },
    },
    {
      key: "stock",
      header: "Stok Tersisa",
      className: "py-4 px-4 whitespace-nowrap",
      render: (item) => {
        return (
          <div className="flex items-center gap-3">
            <span
              className={`font-semibold text-xs ${
                item.stock === 0
                  ? "text-rose-600 dark:text-rose-400"
                  : item.stock < 10
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-800 dark:text-slate-200"
              }`}
            >
              {item.stock} Unit
            </span>
            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
              <div
                style={{ width: `${Percentage}%` }}
                className={`h-full rounded-full transition-all ${
                  item.stock === 0
                    ? "bg-rose-500"
                    : item.stock < 10
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      className: "py-4 px-4 whitespace-nowrap",
      render: (item) => {
        {
          item.status === "Tersedia" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Tersedia
            </span>
          );
        }
        {
          item.status === "Stok Menipis" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Stok Menipis
            </span>
          );
        }
        {
          item.status === "Habis" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Habis
            </span>
          );
        }
      },
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "py-4 px-4 text-center whitespace-nowrap",
      render: (item) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              title="Edit Detail"
              onClick={() => openEditItemModal(item)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Edit />
            </button>
            <button
              type="button"
              title="Edit Detail"
              onClick={() => delteItem(item)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Trash />
            </button>
          </div>
        );
      },
    },
  ];

  // 3. Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 4. Kalkulasi Metrik Ringkasan
  const metrics = useMemo(() => {
    const totalUnits = items.reduce((acc, curr) => acc + Number(curr.stock), 0);
    const lowStockCount = items.filter(
      (i) => i.stock > 0 && i.stock < 10,
    ).length;
    const outOfStockCount = items.filter((i) => Number(i.stock) === 0).length;
    const categoriesSet = new Set(items.map((i) => i.category));
    return {
      totalUnits,
      lowStockCount,
      outOfStockCount,
      totalCategories: categoriesSet.size,
    };
  }, [items]);

  // 6. Reset Filter
  const handleResetFilter = () => {
    setSearchQuery("");
    setSelectedCategory("Semua Kategori");
    setSelectedStatus("Semua Status");
  };

  // Tesdt
  const [selectedItem, setSelectedItem] = useState(null);

  function openCreateItemModal() {
    setSelectedItem(null);
    setIsModalOpen(true);
  }

  function openEditItemModal(item) {
    setSelectedItem(item);
    setIsModalOpen(true);
  }

  async function handleSaveItem(form) {
    const isEdit = Boolean(selectedItem);

    const url = isEdit
      ? `http://localhost:8080/api/item/${selectedItem.id}`
      : `http://localhost:8080/api/item/create`;

    const response = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    console.log("Item terpilih:", selectedItem);

    if (!response.ok) {
      throw new Error(result.error || result.message || "Gagal menyimpan item");
    }

    await loadItems();
    setIsModalOpen(false);
    setSelectedItem(null);
  }
  // Helper Icon Kategori
  const getCategoryIcon = (category) => {
    switch (category) {
      case "IT & Hardware":
        return "bx bx-laptop";
      case "Elektronik":
        return "bx bx-tv";
      case "Furnitur Kantor":
        return "bx bx-chair";
      case "Aksesoris Komputer":
        return "bx bx-mouse";
      case "Peralatan Kantor":
        return "bx bx-printer";
      default:
        return "bx bx-package";
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Navigasi Universal */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        activeMenu="Barang / Inventaris"
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-900 text-[11px] font-semibold text-blue-700 dark:text-blue-300 mb-2">
              <CheckShield />
              <span>ENTERPRISE ASSET REGISTRY • NODE ID: JK-04</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Daftar Barang &amp; Inventaris
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Kelola data stok barang fisik, kategori, dan ketersediaan barang
              inventaris perusahaan secara tersentralisasi dan akurat.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() =>
                alert(
                  "Fitur Ekspor data inventaris CSV/Excel siap diintegrasikan!",
                )
              }
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ArrowInUpSquareHalf />
              <span>Ekspor Data</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus />
              <span>Tambah Barang Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Kartu Metrik Ringkasan Stok */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Unit Terdata */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Unit Terdata
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Container />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metrics.totalUnits.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">
                +3.4% bln ini
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Total aset fisik terdaftar
            </p>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-3/4"></div>
            </div>
          </div>

          {/* Card 2: Stok Menipis */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Stok Menipis (&lt; 10)
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertCircle />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {metrics.lowStockCount}
              </span>
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                Peringatan
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Perlu pesanan ulang segera
            </p>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-1/2"></div>
            </div>
          </div>

          {/* Card 3: Stok Habis */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Stok Habis (Kosong)
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <CrossCircle />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                {metrics.outOfStockCount}
              </span>
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/40 px-1.5 py-0.5 rounded">
                Kritis
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Permintaan tertahan
            </p>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full w-1/4"></div>
            </div>
          </div>

          {/* Card 4: Klasifikasi Kategori */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Klasifikasi Kategori
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Widget />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {metrics.totalCategories}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Aktif
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              Divisi &amp; utilitas terintegrasi
            </p>
            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-slate-700 dark:bg-slate-300 rounded-full w-4/5"></div>
            </div>
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
                placeholder="Cari nama barang, kode SKU, atau spesifikasi..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition-all"
              />
            </div>

            {/* Dropdown Kategori & Status */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-1/2 md:w-44 py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Semua Kategori">Semua Kategori</option>
                <option value="IT & Hardware">IT & Hardware</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Furnitur Kantor">Furnitur Kantor</option>
                <option value="Aksesoris Komputer">Aksesoris Komputer</option>
                <option value="Peralatan Kantor">Peralatan Kantor</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-1/2 md:w-40 py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="Semua Status">Semua Status</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Stok Menipis">Stok Menipis</option>
                <option value="Habis">Habis</option>
              </select>

              {/* Reset Filter Button */}
              <button
                type="button"
                onClick={handleResetFilter}
                title="Reset Filter"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
              >
                <RotateCw />
              </button>
            </div>
          </div>

          {/* Baris Status & Sinkronisasi */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              Menampilkan <strong>{filteredItems.length}</strong> dari{" "}
              <strong>{items.length}</strong> barang terdata
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Sinkronisasi inventaris mutakhir
            </span>
          </div>
        </div>

        {/* Tabel Data Barang & Inventaris */}
        <DataTable
          columns={col}
          data={paginatedItems}
          totalRows={filteredItems.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          emptyMessage="Tidak ada barang yang cocok dengan kriteria filter Anda."
        />
      </main>

      {/* Modal Dialog: Tambah Barang Inventaris Baru */}
      {isModalOpen && (
        <ItemModal
          item={selectedItem}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveItem}
        />
      )}

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
