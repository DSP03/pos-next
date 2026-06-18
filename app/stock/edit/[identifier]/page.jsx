"use client";

import { useRouter } from "next/navigation";
import EditPage from "@/components/common/EditPage";

const StockEditPage = () => {
  const router = useRouter();

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