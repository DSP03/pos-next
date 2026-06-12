"use client";

import CommonListPage from "@/components/common/CommonListPage";

export default function PriceList() {
  return (
    <CommonListPage
      modelName="price"
      keys={["productName","priceType","value"]}
      enableToggle={false}
    />
  );
}