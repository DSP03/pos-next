"use client";

import CommonListPage from "@/components/common/CommonListPage";

export default function CustomerList() {
  return (
    <CommonListPage
      modelName="customer"
      keys={[
        "identifier",
        "name",
        "phoneNo",
        "email",
        "partyType",
        "balance",
        "creditLimit"
      ]}
      enableToggle={true}
    />
  );
}