"use client";

import CommonListPage from "@/components/common/CommonListPage";

export default function WarehouseListPage() {
  return (
    <CommonListPage
      modelName="warehouse"
      keys={[
        "identifier",
        "warehouseName",
        "country",
        "state",
        "cityName",
        "location",
      ]}
    />
  );
}