"use client";

import CommonListModal from "@/components/common/CommonListModal";
import { validateCustomer } from "../utils/customerValidator";

const CUSTOMER_FIELDS = [
  { name: "divider-core", type: "divider", label: "Customer Information" },

  { name: "name", type: "text", label: "Full Name", required: true },
  { name: "phoneNo", type: "phone", label: "Phone Number", required: true },
  { name: "email", type: "email", label: "Email Address" },

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

  { name: "balance", type: "number", label: "Opening Balance" },
  { name: "creditLimit", type: "number", label: "Credit Limit" },

  { name: "status", type: "status", label: "Status" },
];

const INITIAL_FORM = {
  name: "",
  phoneNo: "",
  email: "",
  balance: 0,
  balanceType: "",
  partyType: "",
  creditLimit: 0,
  status: true,
};

export default function CustomerList() {
  return (
    <CommonListModal
      modelName="customer"
      keys={[
        "identifier",
        "name",
        "phoneNo",
        "email",
        "partyType",
        "balance",
        "creditLimit",
      ]}
      enableToggle={true}

      addFields={CUSTOMER_FIELDS}
      addInitialForm={INITIAL_FORM}
      addValidate={validateCustomer}
    />
  );
}