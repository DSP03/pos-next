"use client";

import CommonListPage from "@/components/common/CommonListPage";

const StockListPage = () => {
  return (
    <CommonListPage
      modelName="stock"
      keys={[
        "productIdentifier",
        "warehouseIdentifier",
        "availableQuantity",
        "reorderLevel",
        "stockState",
        "status",
      ]}
      enableToggle={true}
    />
  );
};

export default StockListPage;