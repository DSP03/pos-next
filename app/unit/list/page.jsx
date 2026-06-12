"use client";

import CommonListPage from "@/components/common/CommonListPage";

export default function UnitList() {
  return (
    <CommonListPage
      modelName="unit"
      keys={["identifier","unitName"]}
      enableToggle={true}
    />
  );
}