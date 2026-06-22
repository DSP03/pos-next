"use client";

import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/common/Layout";
import api from "@/services/api";
import DeleteModal from "@/components/common/DeleteModal";
import AddModal from "@/components/common/AddModal";
import FormRenderer from "@/components/common/FormRenderer";
import PageGuard from "./PageGuard";

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

const CommonListModal = ({
  modelName,
  keys = [],
  enableToggle = false,
  hideAddButton = false,
  sizePerPage = 10,

  addFields = [],
  addInitialForm = {},
  addValidate,
  addOptions = {},
}) => {
  const router = useRouter();

  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [refreshFlag, setRefreshFlag] = useState(0);

  // --- Add modal state ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(addInitialForm);
  const [addErrors, setAddErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);

  const loadData = useCallback(
    async (pageNo) => {
      try {
        setLoading(true);

        if (searchQuery.trim()) {
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
        } else {
          const res = await api.post(`/${modelName}/list`, {
            page: pageNo,
            sizePerPage,
          });

          setListData(res.data.dtoList || []);
          setTotalPages(res.data.totalPages || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [modelName, searchQuery, sizePerPage]
  );

  useEffect(() => {
    loadData(page);
  }, [page, refreshFlag, loadData]);

  useEffect(() => {
    loadData(0);
  }, [searchQuery, loadData]);

  const handleDeleteConfirm = async () => {
    try {
      await api.post(`/${modelName}/delete`, {
        identifier: deleteTarget,
      });

      setDeleteTarget(null);
      setRefreshFlag((v) => v + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (item, index) => {
    try {
      await api.post(`/${modelName}/toggle`, {
        identifier: item.identifier,
      });

      const updated = [...listData];

      updated[index].status = !updated[index].status;

      setListData(updated);
    } catch (err) {
      console.error(err);
      setRefreshFlag((v) => v + 1);
    }
  };

  // --- Add modal handlers ---
  const openAddModal = () => {
    setAddForm(addInitialForm);
    setAddErrors({});
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddErrors({});
  };

  const handleAddSubmit = async () => {
    if (addValidate) {
      const err = addValidate(addForm);
      if (err && Object.keys(err).length) {
        setAddErrors(err);
        return;
      }
    }

    try {
      setAddLoading(true);
      setAddErrors({});

      const res = await api.post(`/${modelName}/add`, addForm);

      if (res.data?.success === false) {
        setAddErrors({ api: res.data.message || "Failed to save." });
        return;
      }

      setShowAddModal(false);
      setRefreshFlag((v) => v + 1);
    } catch (err) {
      console.error(err);
      setAddErrors({ api: "Server error. Please try again." });
    } finally {
      setAddLoading(false);
    }
  };

  const displayName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  return (
    <PageGuard>
      <Layout>
        {deleteTarget && (
          <DeleteModal
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
          />
        )}

        <AddModal
          open={showAddModal}
          title={`Add ${displayName}`}
          loading={addLoading}
          onClose={closeAddModal}
          onSubmit={handleAddSubmit}
        >
          <FormRenderer
            fields={addFields}
            form={addForm}
            setForm={setAddForm}
            errors={addErrors}
            options={addOptions}
            columns={2}
          />

          {addErrors.api && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {addErrors.api}
            </div>
          )}
        </AddModal>

        <div className="min-h-screen bg-[#F2F7F8] p-6">
          {/* Header */}

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#003C51]">
                {displayName} List
              </h1>

              <p className="text-[#7A7480] mt-1">Manage {modelName}</p>
            </div>

            {!hideAddButton && (
              <button
                onClick={openAddModal}
                className="bg-[#0097AC] hover:bg-[#006E74] text-white px-5 py-2 rounded-xl"
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
              className="w-72 px-4 py-2 border rounded-xl"
            />
          </div>

          {/* Loading */}

          {loading && (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 rounded-full border-4 border-[#0097AC] border-t-transparent animate-spin" />
            </div>
          )}

          {/* Empty */}

          {!loading && listData.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
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
                        <th key={k} className="text-left p-4 capitalize">
                          {k}
                        </th>
                      ))}

                      {enableToggle && (
                        <th className="text-center p-4">Status</th>
                      )}

                      <th className="text-center p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {listData.map((item, index) => (
                      <tr key={item.identifier} className="border-b hover:bg-gray-50">
                        {keys.map((k) => (
                          <td key={k} className="p-4">
                            {getCellValue(item, k)}
                          </td>
                        ))}

                        {enableToggle && (
                          <td className="text-center p-4">
                            <button
                              onClick={() => handleToggle(item, index)}
                              className={`relative inline-flex h-6 w-12 rounded-full ${
                                item.status ? "bg-green-500" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 rounded-full bg-white mt-1 transition-transform ${
                                  item.status ? "translate-x-7" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </td>
                        )}

                        <td className="p-4 text-center">
                          <button
                            onClick={() =>
                              router.push(`/${modelName}/edit/${item.identifier}`)
                            }
                            className="bg-[#0097AC] text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => setDeleteTarget(item.identifier)}
                            className="bg-red-500 text-white px-3 py-1 rounded ml-2"
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
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Prev
                </button>

                <div className="flex items-center">
                  Page {page + 1} / {totalPages}
                </div>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 bg-gray-200 rounded"
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

export default CommonListModal;

CommonListModal.propTypes = {
  modelName: PropTypes.string.isRequired,
  keys: PropTypes.array,
  enableToggle: PropTypes.bool,
  hideAddButton: PropTypes.bool,
  sizePerPage: PropTypes.number,

  addFields: PropTypes.array,
  addInitialForm: PropTypes.object,
  addValidate: PropTypes.func,
  addOptions: PropTypes.object,
};