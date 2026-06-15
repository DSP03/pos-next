"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/common/Layout";
import PageGuard from "@/components/common/PageGuard";
import FormRenderer from "@/components/common/FormRenderer";
import api from "@/services/api";
import { validateCustomer } from "@/app/customer/utils/customerValidator";

const CUSTOMER_FIELDS = [
  { name: "divider-core", type: "divider", label: "Customer Information" },

  { name: "name",    type: "text",  label: "Full Name",    required: true  },
  { name: "phoneNo", type: "phone", label: "Phone Number", required: true  },
  { name: "email",   type: "email", label: "Email Address", required: false },

  { name: "divider-class", type: "divider", label: "Classification" },

  {
    name: "partyType",
    type: "select",
    label: "Party Type",
    required: true,
    options: [
      { identifier: "individual", label: "Individual" },
      { identifier: "business",   label: "Business"   },
      { identifier: "government", label: "Government" },
    ],
  },
  {
    name: "balanceType",
    type: "radio",
    label: "Balance Type",
    options: [
      { identifier: "credit", label: "Credit" },
      { identifier: "debit",  label: "Debit"  },
    ],
  },

  { name: "divider-fin", type: "divider", label: "Financials" },

  { name: "balance",     type: "number", label: "Opening Balance", min: 0, step: 0.01 },
  { name: "creditLimit", type: "number", label: "Credit Limit",    min: 0, step: 0.01 },

  { name: "status", type: "status", label: "Status" },

  {
    name: "billingAddress",
    type: "section",
    label: "Billing Address",
    fields: [
      { name: "addressLine", type: "textarea", label: "Address Line", rows: 2, span: "full" },
      { name: "city",    type: "text", label: "City"             },
      { name: "state",   type: "text", label: "State"            },
      { name: "zip",     type: "text", label: "ZIP / Postal Code"},
      { name: "country", type: "text", label: "Country"          },
    ],
  },

  {
    name: "shippingAddress",
    type: "section",
    label: "Shipping Address",
    fields: [
      { name: "addressLine", type: "textarea", label: "Address Line", rows: 2, span: "full" },
      { name: "city",    type: "text", label: "City"             },
      { name: "state",   type: "text", label: "State"            },
      { name: "zip",     type: "text", label: "ZIP / Postal Code"},
      { name: "country", type: "text", label: "Country"          },
    ],
  },
];

const INITIAL_FORM = {
  name:        "",
  phoneNo:     "",
  email:       "",
  balance:     0,
  balanceType: "",
  partyType:   "",
  creditLimit: 0,
  status:      true,
  billingAddress:  { addressLine: "", city: "", state: "", zip: "", country: "" },
  shippingAddress: { addressLine: "", city: "", state: "", zip: "", country: "" },
};

export default function CustomerAdd() {
  const router = useRouter();

  const [form,    setForm]    = useState(INITIAL_FORM);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const err = validateCustomer(form);
    if (Object.keys(err).length) {
      setErrors(err);
      const firstKey = Object.keys(err)[0];
      document.querySelector(`[name="${firstKey}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      const res = await api.post("/customer/add", form);
      if (!res.data.success) {
        setErrors({ api: res.data.message });
        return;
      }
      router.push("/customer/list");
    } catch {
      setErrors({ api: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageGuard>
      <Layout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                Customers
              </p>
              <h1 className="text-2xl font-bold text-gray-800">Add Customer</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <FormRenderer
              fields={CUSTOMER_FIELDS}
              form={form}
              setForm={setForm}
              errors={errors}
              columns={2}
            />
          </div>

          {errors.api && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.api}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={submit}
              disabled={loading}
              className="bg-[#0097AC] hover:bg-[#007a8c] disabled:opacity-60
                text-white font-medium px-6 py-2.5 rounded-lg transition
                flex items-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/>
                </svg>
              )}
              {loading ? "Saving…" : "Save Customer"}
            </button>

            <button
              onClick={() => router.push("/customer/list")}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700
                font-medium px-6 py-2.5 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </Layout>
    </PageGuard>
  );
}