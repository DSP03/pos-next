"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PropTypes from "prop-types";
import Layout from "@/components/common/Layout";
import api from "../../services/api";
import FormRenderer from "@/components/common/FormRenderer";

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const EditPage = ({
  modelName,
  title,
  fields = [],
  options = {},
  initialForm = {},
  validate,
  readOnlyFields = [],
  backPath,
  skipFetch = false,
  excludeFromSubmit = ["createdBy", "createdOn", "modifiedBy", "modifiedOn"],
}) => {
  const router = useRouter();
  const params = useParams();
  const identifier = params?.identifier
    ? decodeURIComponent(params.identifier)
    : "";

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(!skipFetch);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resolvedBackPath = backPath || `/${modelName}/list`;
  const displayName = modelName
    ? modelName.charAt(0).toUpperCase() + modelName.slice(1)
    : "";
  const pageTitle = title || `Edit ${displayName}`;

  useEffect(() => {
    if (skipFetch || !identifier || !modelName) {
      setForm(initialForm);
      setDataLoading(false);
      return;
    }
    setDataLoading(true);
    setError("");
    api
      .get(`/${modelName}/get`, { params: { identifier } })
      .then((res) => {
        if (res.data?.success === true) {
          const data = res.data || initialForm;
          setForm({
            ...data,
            createdOn: formatDateTime(data.createdOn),
            modifiedOn: formatDateTime(data.modifiedOn),
          });
        } else {
          setError(res.data?.message || "Failed to load data");
        }
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Failed to load data";
        setError(message);
      })
      .finally(() => setDataLoading(false));
  }, [identifier, modelName, skipFetch]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setFieldErrors({});

    if (validate) {
      const err = validate(form);

      if (err && typeof err === "object" && Object.keys(err).length > 0) {
        setFieldErrors(err);
        return;
      }

      if (err && typeof err === "string") {
        setError(err);
        return;
      }
    }

    const payload = { ...form };
    excludeFromSubmit.forEach((key) => delete payload[key]);

    setLoading(true);
    try {
      const res = await api.put(`/${modelName}/update`, payload,{skipAuthRedirect: true});
      if (res.data?.success === false) {
        setError(res.data.message || "Update failed");
        return;
      }
      setSuccess("Updated successfully");
      setTimeout(() => router.push(resolvedBackPath), 700);
    } catch (err) {
      console.error(`Update failed for ${modelName}:`, err.response?.data || err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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
      <Layout>
        <div className="p-5 text-red-600">modelName is missing</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F2F7F8] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-[#D9E5E7]">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#003C51] to-[#006E74] px-8 py-6">
              <h2 className="text-3xl font-bold text-white">{pageTitle}</h2>
              <p className="text-cyan-100 mt-1 text-sm">
                Update and save record details
              </p>
            </div>

            {/* BODY */}
            <div className="p-8 space-y-6">
              {dataLoading && (
                <div className="flex items-center justify-center py-16">
                  <div className="h-12 w-12 rounded-full border-4 border-[#0097AC] border-t-transparent animate-spin" />
                </div>
              )}

              {!dataLoading && (
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl shadow-sm">
                      <div className="font-semibold">Error</div>
                      <div className="text-sm mt-1">{error}</div>
                    </div>
                  )}

                  {success && (
                    <div className="bg-cyan-50 border border-cyan-200 text-[#006E74] px-4 py-3 rounded-2xl shadow-sm">
                      <div className="font-semibold">Success</div>
                      <div className="text-sm mt-1">{success}</div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl p-6 border border-[#D9E5E7] shadow-sm">
                    <FormRenderer
                      fields={resolvedFields}
                      form={form}
                      setForm={setForm}
                      options={options}
                      errors={fieldErrors}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`flex-1 py-3 rounded-2xl font-semibold text-white transition-all duration-300 shadow-lg ${
                        loading
                          ? "bg-[#7A7480] cursor-not-allowed"
                          : "bg-gradient-to-r from-[#0097AC] to-[#006E74] hover:scale-[1.02] hover:shadow-xl"
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Updating...
                        </div>
                      ) : (
                        "Update"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push(resolvedBackPath)}
                      disabled={loading}
                      className="flex-1 py-3 rounded-2xl font-semibold border border-[#006E74] text-[#006E74] hover:bg-[#F2F7F8] transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

EditPage.propTypes = {
  modelName: PropTypes.string.isRequired,
  title: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
  initialForm: PropTypes.object,
  validate: PropTypes.func,
  readOnlyFields: PropTypes.arrayOf(PropTypes.string),
  backPath: PropTypes.string,
  skipFetch: PropTypes.bool,
  excludeFromSubmit: PropTypes.arrayOf(PropTypes.string),
};

EditPage.defaultProps = {
  fields: [],
  options: {},
  initialForm: {},
  readOnlyFields: [],
  skipFetch: false,
  excludeFromSubmit: ["createdBy", "createdOn", "modifiedBy", "modifiedOn"],
};

export default EditPage;