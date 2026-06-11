"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/common/Layout";
import api from "../../services/api";
import DeleteModal from "@/components/common/DeleteModal";
import FormRenderer from "@/components/common/FormRenderer";
import PropTypes from "prop-types";

const DrawerEditPage = ({
  modelName,
  identifier,
  fields = [],
  options = {},
  initialForm = {},
  validate,
  readOnlyFields = [],
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!identifier || !modelName) {
      setForm(initialForm);
      setDataLoading(false);
      return;
    }
    setDataLoading(true);
    setError("");
    api
      .get(`/${modelName}/get`, { params: { identifier } })
      .then((res) => {
        if (res.data?.success === false) {
          setError(res.data?.message || "Failed to load data");
        } else {
          setForm(res.data || initialForm);
        }
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setDataLoading(false));
  }, [identifier, modelName]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (validate) {
      const err = validate(form);
      if (err) { setError(err); return; }
    }
    setLoading(true);
    try {
      const res = await api.post(`/${modelName}/update`, form);
      if (res.data?.success === false) {
        setError(res.data.message || "Update failed");
        return;
      }
      setSuccess("Updated successfully");
      setTimeout(() => onSuccess?.(), 700);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resolvedFields = fields.map((f) => ({
    ...f,
    disabled: f.disabled || readOnlyFields.includes(f.name),
  }));

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 rounded-full border-4 border-[#0097AC] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
          <strong>Error: </strong>{error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
          <strong>Success: </strong>{success}
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
        <FormRenderer
          fields={resolvedFields}
          form={form}
          setForm={setForm}
          options={options}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading || dataLoading}
          className={`flex-1 rounded-xl py-3 font-semibold text-white transition-all ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-[#0097AC] hover:bg-[#006E74]"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{' '}
              Updating...
            </span>
          ) : (
            "Update"
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

DrawerEditPage.propTypes = {
  modelName: PropTypes.string,
  identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fields: PropTypes.array,
  options: PropTypes.object,
  initialForm: PropTypes.object,
  validate: PropTypes.func,
  readOnlyFields: PropTypes.array,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

const CommonListPage = ({
  modelName,
  keys = [],
  enableToggle = false,
  hideAddButton = false,
  editFields = [],
  editOptions = {},
  editInitialForm = {},
  editValidate,
  editReadOnly = [],
}) => {
  const router = useRouter();

  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [drawerIdentifier, setDrawerIdentifier] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const sizePerPage = 10;

  const loadData = useCallback(
    async (pageNo) => {
      try {
        setLoading(true);
        if (searchQuery.trim() === "") {
          const res = await api.post(`/${modelName}/list`, {
            page: pageNo,
            sizePerPage,
          });
          setListData(res.data.dtoList || []);
          setTotalPages(res.data.totalPages || 0);
        } else {
          const res = await api.post(`/${modelName}/list`, {
            page: 0,
            sizePerPage: 1000,
          });
          const allData = res.data.dtoList || [];
          const filtered = allData.filter((item) =>
            JSON.stringify(item)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
          setListData(filtered);
          setTotalPages(1);
          setPage(0);
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

  const handleToggle = async (item, index) => {
    try {
      await api.post(`/${modelName}/toggle`, { identifier: item.identifier });
      const updated = [...listData];
      updated[index].status = !updated[index].status;
      setListData(updated);
    } catch (err) {
      console.error("Error toggling:", err);
      alert("Toggle failed. Please try again.");
      setRefreshFlag((f) => f + 1);
    }
  };

  const handleDrawerSuccess = () => {
    setDrawerIdentifier(null);
    setTimeout(() => setRefreshFlag((f) => f + 1), 300);
  };

  const displayName =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  if (!modelName) {
    return (
      <Layout>
        <div className="p-5 text-red-600">modelName is missing</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Drawer backdrop */}
      {drawerIdentifier && (
        <button
          type="button"
          onClick={() => setDrawerIdentifier(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setDrawerIdentifier(null);
            }
          }}
          aria-label="Close drawer"
          className="fixed inset-0 z-40 bg-black/35"
        />
      )}

      {/* Side drawer — pure React, no iframe */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "clamp(340px, 45vw, 680px)",
          zIndex: 50,
          background: "#fff",
          boxShadow: "-4px 0 32px rgba(0,0,0,0.18)",
          transform: drawerIdentifier ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            background: "#006E74",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "white", fontWeight: 600, fontSize: "16px" }}>
            Edit {displayName}
          </span>
          <button
            onClick={() => setDrawerIdentifier(null)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontSize: "22px",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Drawer body — inline React edit form */}
        {drawerIdentifier && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <DrawerEditPage
              key={drawerIdentifier}
              modelName={modelName}
              identifier={drawerIdentifier}
              fields={editFields}
              options={editOptions}
              initialForm={editInitialForm}
              validate={editValidate}
              readOnlyFields={editReadOnly}
              onSuccess={handleDrawerSuccess}
              onCancel={() => setDrawerIdentifier(null)}
            />
          </div>
        )}
      </div>

      {/* ── Main page content ── */}
      <div className="min-h-screen bg-[#F2F7F8] p-6">
        {/* Page header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#003C51]">
              {displayName} List
            </h1>
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

        {/* Search */}
        <div className="mb-5 flex justify-end">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-72 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0097AC]"
          />
        </div>

        {/* Loading spinner */}
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
                      <th
                        key={k}
                        className="text-left p-4 capitalize whitespace-nowrap"
                      >
                        {k}
                      </th>
                    ))}
                    {enableToggle && (
                      <th className="p-4 text-center whitespace-nowrap">
                        Status
                      </th>
                    )}
                    <th className="p-4 text-center w-40 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listData.map((item, index) => (
                    <tr
                      key={item.identifier || index}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      {keys.map((k) => {
                        let displayValue;
                        if (Array.isArray(item?.[k])) {
                          displayValue = (
                            <div className="max-w-xs truncate">
                              {item[k]
                                .map((v) => (typeof v === "object" ? v.name : v))
                                .join(", ")}
                            </div>
                          );
                        } else if (typeof item?.[k] === "object") {
                          displayValue = item?.[k]?.name;
                        } else {
                          displayValue = String(item?.[k] ?? "-");
                        }

                        return (
                          <td key={k} className="p-4 whitespace-nowrap">
                            {displayValue}
                          </td>
                        );
                      })}

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
                                item.status
                                  ? "translate-x-7"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      )}

                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          onClick={() =>
                            setDrawerIdentifier(item.identifier)
                          }
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
                disabled={
                  page >= totalPages - 1 || searchQuery.trim() !== ""
                }
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
  keys: PropTypes.array,
  enableToggle: PropTypes.bool,
  hideAddButton: PropTypes.bool,
  editFields: PropTypes.array,
  editOptions: PropTypes.object,
  editInitialForm: PropTypes.object,
  editValidate: PropTypes.func,
  editReadOnly: PropTypes.array,
};

export default CommonListPage;