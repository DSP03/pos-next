"use client";

import ListPage from "@/components/common/ListPage";

export default function UnitList() {
  return (
    <ListPage
      modelName="unit"
      keys={["identifier","unitName"]}
      enableToggle={true}
    />
  );
}