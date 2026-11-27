import { useMemo, useState } from "react";
import { Search, Plus, Download, Filter } from "lucide-react";

import StatusBadge from "./StatusBadge";

const ManagementPage = ({
  title,
  description,
  columns,
  initialData,
  searchFields,
  addLabel,
}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const matchesSearch = searchFields.some((field) =>
        String(item[field] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      );

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [initialData, search, status, searchFields]);

  const statuses = [
    "All",
    ...new Set(initialData.map((item) => item.status).filter(Boolean)),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>

        <button
          onClick={() => window.alert("Connect your create API here")}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus size={18} />
          {addLabel || "Add New"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 py-3">
            <Search size={18} className="text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={17} className="text-gray-400" />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.alert("Connect CSV export here")}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Download size={17} />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-5 py-4">
                    {column.label}
                  </th>
                ))}

                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-5 py-4 text-sm text-gray-700"
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}

                  <td className="px-5 py-4">
                    <StatusBadge status={item.status || "Active"} />
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => window.alert("Connect edit API here")}
                      className="text-sm font-semibold text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
          Showing {filteredData.length} of {initialData.length} records
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
