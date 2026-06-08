"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/common/Layout";
import api from "../../services/api";
import FormRenderer from "@/components/common/FormRenderer";
import PageGuard from "./PageGuard";

const EditPage = ({
  modelName,
  title,
  fields = [],
  options = {},
  initialForm = {},
  validate,
  readOnlyFields = [],
  backPath,
}) => {
  const router = useRouter();
  const params = useParams();
  const identifier = params?.identifier
    ? decodeURIComponent(params.identifier)
    : "";

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resolvedBackPath = backPath || `/${modelName}/list`;
  const displayName = modelName
    ? modelName.charAt(0).toUpperCase() + modelName.slice(1)
    : "";
  const pageTitle = title || `Edit ${displayName}`;

  // Fetch existing record
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
        if (res.data?.success !== false) {
          setForm(res.data || initialForm);
        } else {
          setError(res.data?.message || "Failed to load data");
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
      setTimeout(() => router.push(resolvedBackPath), 700);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resolvedFields = fields.map((f) => ({
    ...f,
    disabled: f.disabled || readOnlyFields.includes(f.name),
  }));

  if (!modelName) {
    return (
      <PageGuard>
      <Layout>
        <div className="p-5 text-red-600">modelName is missing</div>
      </Layout>
      </PageGuard>
    );
  }

  return (
    <PageGuard>
    <Layout>
      <div className="min-h-screen bg-[#F2F7F8] p-6">
        {/* Page header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push(resolvedBackPath)}
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            title="Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#003C51]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#003C51]">{pageTitle}</h1>
            <p className="text-[#7A7480] mt-1">Update {modelName} details below</p>
          </div>
        </div>

        {/* Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card header accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#0097AC] to-[#006E74]" />

          <div className="p-8 space-y-6">
            {/* Data loading state */}
            {dataLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="h-12 w-12 rounded-full border-4 border-[#0097AC] border-t-transparent animate-spin" />
              </div>
            )}

            {/* Form content */}
            {!dataLoading && (
              <>
                {/* Error banner */}
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-0.5 h-5 w-5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-sm">Error</p>
                      <p className="text-sm mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success banner */}
                {success && (
                  <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-0.5 h-5 w-5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-sm">Success</p>
                      <p className="text-sm mt-0.5">{success}</p>
                    </div>
                  </div>
                )}

                {/* Fields */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                  <FormRenderer
                    fields={resolvedFields}
                    form={form}
                    setForm={setForm}
                    options={options}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3 sm:flex-row pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex-1 rounded-xl py-3 font-semibold text-white shadow transition-all ${
                      loading
                        ? "cursor-not-allowed bg-[#0097AC]/50"
                        : "bg-[#0097AC] hover:bg-[#006E74] active:scale-[0.98]"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      "Update"
                    )}
                  </button>

                  <button
                    onClick={() => router.push(resolvedBackPath)}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 hover:bg-gray-200 active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
    </PageGuard>
  );
};

export default EditPage;