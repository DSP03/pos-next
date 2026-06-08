"use client";

import SimpleListPage from "@/components/common/SimpleListPage";

export default function UserList() {
  return (
    <SimpleListPage
      modelName="user"
      keys={["username", "name", "phoneNo", "roles"]}
      hideAddButton
    />
  );
}