"use client";

import EditPage from "@/components/common/EditPage";

const StockEditPage = () => {

  return (
    <EditPage
      modelName="stock"
      title="Edit Stock"
      initialForm={{
        productIdentifier: "",
        warehouseIdentifier: "",
        availableQuantity: 0,
        reorderLevel: 0,
        status: true,
        createdBy: "",
        createdOn: "",
        modifiedBy: "",
        modifiedOn: "",
      }}
      fields={[
        {
          name: "productIdentifier",
          type: "text",
          label: "Product Identifier",
          disabled: true,
        },
        {
          name: "warehouseIdentifier",
          type: "text",
          label: "Warehouse Identifier",
          disabled: true,
        },
        {
          name: "availableQuantity",
          type: "number",
          label: "Available Quantity",
          required: true,
        },
        {
          name: "reorderLevel",
          type: "number",
          label: "Reorder Level",
        },
        {
          name: "status",
          type: "checkbox",
          label: "Active",
        },
        {
          name: "createdBy",
          type: "text",
          label: "Created By",
          disabled: true,
        },
        {
          name: "createdOn",
          type: "text",
          label: "Created On",
          disabled: true,
        },
        {
          name: "modifiedBy",
          type: "text",
          label: "Modified By",
          disabled: true,
        },
        {
          name: "modifiedOn",
          type: "text",
          label: "Modified On",
          disabled: true,
        },
      ]}
      readOnlyFields={[
        "productIdentifier",
        "warehouseIdentifier",
      ]}
      validate={(form) => {
        const errors = {};

        if (
          form.availableQuantity === null ||
          form.availableQuantity === undefined ||
          form.availableQuantity < 0
        ) {
          errors.availableQuantity =
            "Available quantity must be 0 or greater";
        }

        if (
          form.reorderLevel !== null &&
          form.reorderLevel !== undefined &&
          form.reorderLevel < 0
        ) {
          errors.reorderLevel =
            "Reorder level must be 0 or greater";
        }

        return errors;
      }}
      backPath="/stock/list"
    />
  );
};

export default StockEditPage;