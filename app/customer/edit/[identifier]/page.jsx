"use client";

import EditPage from "@/components/common/EditPage";
import { validateCustomerWithAddress } from "@/app/customer/utils/customerValidator";
import { CUSTOMER_CORE_FIELDS } from "@/app/customer/utils/CoreCustomerFields";
import { AUDIT_FIELDS } from "@/components/common/AuditFields";

const CUSTOMER_FIELDS = [
  ...CUSTOMER_CORE_FIELDS,

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

  ...AUDIT_FIELDS,
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