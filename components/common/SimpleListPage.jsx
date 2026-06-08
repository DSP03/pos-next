"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/common/Layout";
import PageGuard from "./PageGuard";
import api from "../../services/api";
import DeleteModal from "@/components/common/DeleteModal";

const SimpleListPage = ({ modelName, keys = [], hideAddButton = false }) => {
  const router = useRouter();

  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const sizePerPage = 10;

  const loadData = useCallback(
    async (pageNo) => {
      try {
        setLoading(true);
        if (searchQuery.trim() !== "") {
          const res = await api.post(`/${modelName}/list`, { page: 0, sizePerPage: 1000 });
          const allData = res.data.dtoList || [];
          const filtered = allData.filter((item) =>
            JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
          );
          setListData(filtered);
          setTotalPages(1);
          setPage(0);
        } else {
          const res = await api.post(`/${modelName}/list`, { page: pageNo, sizePerPage });
          setListData(res.data.dtoList || []);
          setTotalPages(res.data.totalPages || 0);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    },
    [modelName, searchQuery]
  );

  useEffect(() => {
    if (modelName) loadData(page);
  }, [modelName, page, refreshFlag]);

  useEffect(() => {
    if (modelName) loadData(0);
  }, [searchQuery]);

  const handleDeleteConfirm = async () => {
    try {
      await api.post(`/${modelName}/delete`, { identifier: deleteTarget });
      setDeleteTarget(null);
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Delete failed. Please try again.");
    }
  };

  const displayName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  if (!modelName) {
    return<PageGuard> <Layout><div className="p-5 text-red-600">modelName is missing</div></Layout></PageGuard>;
  }

  return (
    <PageGuard>
    <Layout>
      {deleteTarget && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="min-h-screen bg-[#F2F7F8] p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#003C51]">{displayName} List</h1>
            <p className="text-[#7A7480] mt-1">Manage {modelName} details</p>
          </div>
          {!hideAddButton && (
            <button
              onClick={() => router.push(`/${modelName}/add`)}
              className="bg-[#0097AC] hover:bg-[#006E74] text-white px-5 py-2 rounded-xl transition-colors"
            >
              + Add
            </button>
          )}
        </div>

        <div className="mb-5 flex justify-end">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-72 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0097AC]"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-[#0097AC] border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && listData.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
            No Data Found
          </div>
        )}

        {!loading && listData.length > 0 && (
          <>
            <div className="bg-white rounded-2xl shadow-xl overflow-x-auto border">
              <table className="min-w-max w-full">
                <thead className="bg-[#006E74] text-white">
                  <tr>
                    {keys.map((k) => (
                      <th key={k} className="text-left p-4 capitalize whitespace-nowrap">{k}</th>
                    ))}
                    <th className="p-4 text-center w-40 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listData.map((item, index) => (
                    <tr key={item.identifier || index} className="border-b hover:bg-gray-50 transition-colors">
                      {keys.map((k) => (
                        <td key={k} className="p-4 whitespace-nowrap">
                          {Array.isArray(item?.[k])
                            ? (
                              <div className="max-w-xs truncate">
                                {item[k].map((v) => (typeof v === "object" ? v.name : v)).join(", ")}
                              </div>
                            )
                            : typeof item?.[k] === "object"
                            ? item?.[k]?.name
                            : String(item?.[k] ?? "-")}
                        </td>
                      ))}
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/${modelName}/edit/${item.identifier}`)}
                          className="bg-[#0097AC] hover:bg-[#006E74] text-white px-3 py-1 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item.identifier)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0 || searchQuery.trim() !== ""}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Prev
              </button>
              <div className="flex items-center text-sm text-gray-600">
                Page {page + 1} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1 || searchQuery.trim() !== ""}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
    </PageGuard>
  );
};

export default SimpleListPage;