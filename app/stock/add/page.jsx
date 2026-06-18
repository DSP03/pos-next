"use client";

import AddPage from "@/components/common/AddPage";
import { useRouter } from "next/navigation";

const StockAddPage = () => {
  const router = useRouter();

  return (
    <AddPage
      title="Add Stock"
      modelName="stock"
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
          required: true,
        },
        {
          name: "warehouseIdentifier",
          type: "text",
          label: "Warehouse Identifier",
          required: true,
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
          type: "status",
          label: "Active",
        },
      ]}
      validate={(form) => {
        const errors = {};

        if (!form.productIdentifier)
          errors.productIdentifier = "Product is required";

        if (!form.warehouseIdentifier)
          errors.warehouseIdentifier = "Warehouse is required";

        if (form.availableQuantity < 0)
          errors.availableQuantity = "Quantity cannot be negative";

        if (form.reorderLevel < 0)
          errors.reorderLevel = "Reorder level cannot be negative";

        return errors;
      }}
      onSuccess={() => router.push("/stock/list")}
      onCancel={() => router.push("/stock/list")}
    />
  );
};

export default StockAddPage;