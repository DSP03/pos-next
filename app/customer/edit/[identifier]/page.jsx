"use client";

import EditPage from "@/components/common/EditPage";
import { validateCustomerWithAddress } from "@/app/customer/utils/customerValidator";

const CUSTOMER_FIELDS = [
  { name: "divider-core", type: "divider", label: "Customer Information" },

  { name: "name", type: "text", label: "Full Name", required: true },
  {
    name: "phoneNo",
    type: "phone",
    label: "Phone Number",
    required: true,
    disabled: true,
  },
  {
    name: "email",
    type: "email",
    label: "Email Address",
  },

  { name: "divider-class", type: "divider", label: "Classification" },

  {
    name: "partyType",
    type: "select",
    label: "Party Type",
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

  {
    name: "balance",
    type: "number",
    label: "Opening Balance",
    min: 0,
    step: 0.01,
  },
  {
    name: "creditLimit",
    type: "number",
    label: "Credit Limit",
    min: 0,
    step: 0.01,
  },

  {
    name: "status",
    type: "status",
    label: "Status",
  },

  {
    name: "billingAddress",
    type: "section",
    label: "Billing Address",
    fields: [
      {
        name: "addressLine",
        type: "textarea",
        label: "Address Line",
        rows: 2,
        span: "full",
      },
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
      {
        name: "addressLine",
        type: "textarea",
        label: "Address Line",
        rows: 2,
        span: "full",
      },
      { name: "city", type: "text", label: "City" },
      { name: "state", type: "text", label: "State" },
      { name: "zip", type: "text", label: "ZIP / Postal Code" },
      { name: "country", type: "text", label: "Country" },
    ],
  },

  {
    name: "createdBy",
    label: "Created By",
    type: "text",
    disabled: true,
  },
  {
    name: "createdOn",
    label: "Created On",
    type: "text",
    disabled: true,
  },
  {
    name: "modifiedBy",
    label: "Modified By",
    type: "text",
    disabled: true,
  },
  {
    name: "modifiedOn",
    label: "Modified On",
    type: "text",
    disabled: true,
  },
];

export default function CustomerEdit() {
  return (
    <EditPage
      title="Edit Customer"
      modelName="customer"
      fields={CUSTOMER_FIELDS}
      validate={(form) => {
        const errors = validateCustomerWithAddress(form);

        if (Object.keys(errors).length > 0) {
          return errors;
        }

        return null;
      }}
      backPath="/customer/list"
    />
  );
}