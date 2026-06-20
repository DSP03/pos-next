"use client";

import EditPage from "@/components/common/EditPage";

export default function PriceEdit() {
  return (
    <EditPage
      title="Edit Price"
      modelName="price"
      fields={[
        {
          name: "identifier",
          label: "Identifier",
          type: "text",
          disabled: true,
        },
        {
          name: "productId",
          label: "Product",
          type: "text",
          disabled: true,
        },
        {
          name: "priceType",
          label: "Price Type",
          type: "text",
          disabled: true,
        },
        {
          name: "value",
          label: "Value",
          type: "text",
          inputMode: "decimal",
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
      ]}
      validate={(form) => {
        if (!form.value && form.value !== 0) {
          return "Value is required";
        }

        if (Number.isNaN(Number(form.value)) || Number(form.value) <= 0) {
          return "Value must be a positive number";
        }

        return null;
      }}
    />
  );
}