"use client";

import ListPage from "@/components/common/ListPage";

export default function RoleList() {
  return (
    <ListPage
      modelName="role"
      keys={["identifier","description"]}
      enableToggle={false}
    />
  );
}