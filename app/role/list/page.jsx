"use client";

import CommonListPage from "@/components/common/CommonListPage";

export default function RoleList() {
  return (
    <CommonListPage
      modelName="role"
      keys={["identifier","description"]}
      enableToggle={false}
    />
  );
}