import { ArrowLeft, ArrowRight } from "@boxicons/react";

export default function DataTable({
  columns = [],
  data = [],
  totalRows = data.length,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  getRowKey = (row, index) => row.id ?? index,
  emptyMessage = "Tidak ada data yang cocok dengan kriteria filter Anda.",
}) {
  const totalPages = Math.ceil(totalRows / pageSize);
  const pageStartIndex = totalRows === 0 ? 0 : (currentPage - 1) * pageSize;
  const pageEndIndex = Math.min(pageStartIndex + data.length, totalRows);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4 sm:px-6">ID</th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.headerClassName ?? "py-3.5 px-4"}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs sm:text-sm">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-slate-400 dark:text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-4 sm:px-6 font-mono font-semibold text-blue-600 dark:text-blue-400 text-xs">
                    <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/60">
                      {pageStartIndex + index + 1}
                    </span>
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={column.className ?? "py-4 px-4"}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Menampilkan baris <strong>{pageStartIndex + (data.length ? 1 : 0)}</strong>{" "}
          sampai <strong>{pageEndIndex}</strong> dari <strong>{totalRows}</strong> total entri
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 disabled:text-slate-300 dark:disabled:text-slate-600 flex items-center gap-1 text-xs disabled:cursor-not-allowed"
          >
            <ArrowLeft />
            <span>Sebelumnya</span>
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange?.(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`w-8 h-8 rounded-lg font-semibold text-xs flex items-center justify-center transition-colors ${
                  currentPage === page
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:text-slate-300 dark:disabled:text-slate-600 flex items-center gap-1 text-xs transition-colors disabled:cursor-not-allowed"
          >
            <span>Berikutnya</span>
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
