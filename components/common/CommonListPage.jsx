"use client";

import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/common/Layout";
import api from "../../services/api";
import DeleteModal from "@/components/common/DeleteModal";

const getCellValue = (item, k) => {
  const raw = item?.[k];

  if (Array.isArray(raw)) {
    return (
      <div className="max-w-xs truncate">
        {raw.map((v) => (typeof v === "object" ? v.name : v)).join(", ")}
      </div>
    );
  }

  if (raw && typeof raw === "object") {
    return raw.name ?? "-";
  }

  return String(raw ?? "-");
};

const CommonListPage = ({
  modelName,
  keys = [],
  enableToggle = false,
  hideAddButton = false,
  sizePerPage = 10,
  onAddClick,
  externalRefresh = 0,
}) => {
  const router = useRouter();

  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const loadData = useCallback(
    async (pageNo) => {
      try {
        setLoading(true);

        const res = await api.post(`/${modelName}/list`, {
          page: pageNo,
          sizePerPage,
          keyword: debouncedQuery || undefined,
        });

        setListData(res.data.dtoList || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (err) {
        console.log(err.response);

        if (err.response) {
          console.log("Status:", err.response.status);
          console.log("Data:", err.response.data);
        }

        alert(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    },
    [modelName, debouncedQuery, sizePerPage]
  );

  useEffect(() => {
    if (modelName) loadData(page);
  }, [modelName, page, refreshFlag, externalRefresh, loadData]);

  useEffect(() => {
    if (modelName) {
      setPage(0);
      loadData(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, modelName]);

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/${modelName}/delete`, {
        data: { identifier: deleteTarget },
        skipAuthRedirect: true,
      });
      setDeleteTarget(null);
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed. Please try again.");
      setDeleteTarget(null);
    }
  };

  const handleToggle = async (item, index) => {
    try {
      const res = await api.patch(
        `/${modelName}/toggle`,
        { identifier: item.identifier },
        { skipAuthRedirect: true }
      );
      const updated = [...listData];
      updated[index] = { ...updated[index], ...res.data };
      setListData(updated);
    } catch (err) {
      console.error("Error toggling:", err);
      alert(err.response?.data?.message || "Toggle failed. Please try again.");
      setRefreshFlag((f) => f + 1);
    }
  };

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      router.push(`/${modelName}/add`);
    }
  };

  const displayName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  if (!modelName) {
    return (
      <Layout>
        <div className="p-5 text-red-600">modelName is missing</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {deleteTarget && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="min-h-screen bg-[#F2F7F8] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#003C51]">{displayName} List</h1>
            <p className="text-[#7A7480] mt-1">Manage {modelName} details</p>
          </div>
          {!hideAddButton && (
            <button
              onClick={handleAddClick}
              className="bg-[#0097AC] hover:bg-[#006E74] text-white px-5 py-2 rounded-xl transition-colors"
            >
              + Add
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-5 flex justify-end">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-72 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0097AC]"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 rounded-full border-4 border-[#0097AC] border-t-transparent animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && listData.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
            No Data Found
          </div>
        )}

        {/* Table */}
        {!loading && listData.length > 0 && (
          <>
            <div className="bg-white rounded-2xl shadow-xl overflow-x-auto border">
              <table className="min-w-max w-full">
                <thead className="bg-[#006E74] text-white">
                  <tr>
                    {keys.map((k) => (
                      <th key={k} className="text-left p-4 capitalize whitespace-nowrap">
                        {k}
                      </th>
                    ))}
                    {enableToggle && (
                      <th className="p-4 text-center whitespace-nowrap">Status</th>
                    )}
                    <th className="p-4 text-center w-40 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listData.map((item, index) => (
                    <tr
                      key={item.identifier || index}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      {keys.map((k) => (
                        <td key={k} className="p-4 whitespace-nowrap">
                          {getCellValue(item, k)}
                        </td>
                      ))}

                      {enableToggle && (
                        <td className="p-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggle(item, index)}
                            title={item.status ? "Active" : "Inactive"}
                            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                              item.status ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                                item.status ? "translate-x-7" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      )}

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

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Prev
              </button>
              <div className="flex items-center text-sm text-gray-600">
                Page {page + 1} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

CommonListPage.propTypes = {
  modelName: PropTypes.string.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string),
  enableToggle: PropTypes.bool,
  hideAddButton: PropTypes.bool,
  sizePerPage: PropTypes.number,
  onAddClick: PropTypes.func,
  externalRefresh: PropTypes.number,
};

export default CommonListPage;