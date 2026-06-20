"use client";

import EditPage from "@/components/common/EditPage";

export default function UnitEdit() {
  return (
    <EditPage
      title="Edit Unit"
      modelName="unit"
      fields={[
        { name: "identifier", label: "Identifier", type: "text", disabled: true },
        { name: "unitName", label: "Unit Name", type: "text", disabled: true },
        { name: "status", label: "Status", type: "status" },
        { name: "createdBy", label: "Created By", type: "text", disabled: true },
        { name: "createdOn", label: "Created On", type: "text", disabled: true },
        { name: "modifiedBy", label: "Modified By", type: "text", disabled: true },
        { name: "modifiedOn", label: "Modified On", type: "text", disabled: true },
      ]}
    />
  );
}