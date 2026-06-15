"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/common/Layout";
import PageGuard from "@/components/common/PageGuard";
import FormRenderer from "@/components/common/FormRenderer";
import api from "@/services/api";
import { validateCustomer } from "@/app/customer/utils/customerValidator";

const CUSTOMER_FIELDS = [
  { name: "divider-core", type: "divider", label: "Customer Information" },

  { name: "name", type: "text", label: "Full Name", required: true },
  { name: "phoneNo", type: "phone", label: "Phone Number", required: true, disabled: true },
  { name: "email", type: "email", label: "Email Address", required: false },

  { name: "divider-class", type: "divider", label: "Classification" },

  {
    name: "partyType",
    type: "select",
    label: "Party Type",
    required: true,
    options: [
      { identifier: "individual", label: "Individual" },
      { identifier: "business", label: "Business" },
      { identifier: "government", label: "Government" },
    ],
  },

  {
    name: "balanceType",
    type: "radio",
    label: "Balance Type",
    options: [
      { identifier: "credit", label: "Credit" },
      { identifier: "debit", label: "Debit" },
    ],
  },

  { name: "divider-fin", type: "divider", label: "Financials" },

  { name: "balance", type: "number", label: "Opening Balance", min: 0, step: 0.01 },
  { name: "creditLimit", type: "number", label: "Credit Limit", min: 0, step: 0.01 },

  { name: "status", type: "status", label: "Status" },

  {
    name: "billingAddress",
    type: "section",
    label: "Billing Address",
    fields: [
      { name: "addressLine", type: "textarea", label: "Address Line", rows: 2, span: "full" },
      { name: "city", type: "text", label: "City" },
      { name: "state", type: "text", label: "State" },
      { name: "zip", type: "text", label: "ZIP / Postal Code" },
      { name: "country", type: "text", label: "Country" },
    ],
  },

  {
    name: "shippingAddress",
    type: "section",
    label: "Shipping Address",
    fields: [
      { name: "addressLine", type: "textarea", label: "Address Line", rows: 2, span: "full" },
      { name: "city", type: "text", label: "City" },
      { name: "state", type: "text", label: "State" },
      { name: "zip", type: "text", label: "ZIP / Postal Code" },
      { name: "country", type: "text", label: "Country" },
    ],
  },
];

const EMPTY_ADDRESS = {
  addressLine: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

const normalizeForm = (data) => ({
  name: data?.name ?? "",
  phoneNo: data?.phoneNo ?? "",
  email: data?.email ?? "",
  balance: data?.balance ?? 0,
  balanceType: data?.balanceType ?? "",
  partyType: data?.partyType ?? "",
  creditLimit: data?.creditLimit ?? 0,
  status: data?.status ?? true,
  billingAddress: data?.billingAddress ?? { ...EMPTY_ADDRESS },
  shippingAddress: data?.shippingAddress ?? { ...EMPTY_ADDRESS },
});

export default function CustomerEdit() {
  const router = useRouter();
  const { identifier } = useParams();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!identifier) return;

    const load = async () => {
      try {
        const res = await api.get(`/customer/get`, {
          params: { identifier },
        });

        if (!res.data) {
          setErrors({ api: "Customer not found." });
          return;
        }

        setForm(normalizeForm(res.data));
      } catch (e) {
        setErrors({
          api: e?.response?.data?.message || "Failed to load customer.",
        });
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [identifier]);

  const submit = async () => {
    const err = validateCustomer(form);

    if (Object.keys(err).length) {
      setErrors(err);

      const firstKey = Object.keys(err)[0];
      document
        .querySelector(`[name="${firstKey}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });

      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const res = await api.post(`/customer/update`, { ...form, identifier });

      if (!res.data?.success) {
        setErrors({ api: res.data?.message || "Update failed" });
        return;
      }

      router.push("/customer/list");
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        "Server error. Please try again.";
      setErrors({ api: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageGuard>
      <Layout>
        <div className="p-6 max-w-4xl mx-auto">

          <div className="mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Customers
            </p>
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Customer
            </h1>
          </div>

          {fetching ? (
            <div className="bg-white p-12 flex justify-center rounded-2xl shadow-sm border">
              <svg className="w-6 h-6 animate-spin text-[#0097AC]" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </div>
          ) : (
            form && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <FormRenderer
                  fields={CUSTOMER_FIELDS}
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  columns={2}
                />
              </div>
            )
          )}

          {errors.api && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.api}
            </div>
          )}

          {!fetching && form && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={submit}
                disabled={loading}
                className="bg-[#0097AC] text-white px-6 py-2.5 rounded-lg disabled:opacity-60"
              >
                {loading ? "Saving..." : "Update Customer"}
              </button>

              <button
                onClick={() => router.push("/customer/list")}
                className="border px-6 py-2.5 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </Layout>
    </PageGuard>
  );
}