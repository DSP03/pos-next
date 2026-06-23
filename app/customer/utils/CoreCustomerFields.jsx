export const CUSTOMER_CORE_FIELDS = [
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

export const CUSTOMER_INITIAL_FORM = {
  name: "",
  phoneNo: "",
  email: "",
  balance: 0,
  balanceType: "",
  partyType: "",
  creditLimit: 0,
  status: true,
};