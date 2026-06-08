"use client";

import ListPage from "@/components/common/ListPage";

export default function BrandList() {
  return (
    <ListPage
      modelName="brand"
      keys={[
        "identifier",
        "brandName",
        "description"
      ]}
      enableToggle={true}
    />
  );
}