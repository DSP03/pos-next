"use client";

import ListPage from "@/components/common/ListPage";

export default function PriceList() {
  return (
    <ListPage
      modelName="price"
      keys={["productName","priceType","value"]}
      enableToggle={false}
    />
  );
}