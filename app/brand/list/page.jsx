"use client";

import ListPage from "@/components/common/CommonListPage";

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