"use client";

import CommonListPage from "@/components/common/CommonListPage";

export default function UserList() {
  return (
    <CommonListPage
      modelName="user"
      keys={["username", "name", "phoneNo", "roles"]}
    />
  );
}