"use client";

import CommonListPage from "@/components/common/CommonListPage";

export default function RackListPage() {
  return (
    <CommonListPage
      modelName="rack"
      keys={["name", "shelfIdentifiers"]}
      enableToggle={true}
    />
  );
}