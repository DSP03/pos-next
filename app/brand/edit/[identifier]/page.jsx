"use client";

import EditPage from "@/components/common/EditPage";

export default function BrandEdit() {

  const fields = [
    { name: "identifier", label: "Identifier", type: "text", disabled: true },
    { name: "brandName", label: "Brand Name", type: "text", disabled: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "status", label: "Status", type: "status" },
    { name: "createdBy", label: "Created By", type: "text", disabled: true },
    { name: "createdOn", label: "Created On", type: "text", disabled: true },
    { name: "modifiedBy", label: "Modified By", type: "text", disabled: true },
    { name: "modifiedOn", label: "Modified On", type: "text", disabled: true },
  ];

  const validate = (form) => {
    if (!form.brandName?.trim()) {
      return "Brand Name is required";
    }
    return null;
  };

  return (
    <EditPage
      title="Edit Brand"
      modelName="brand"
      fields={fields}
      validate={validate}
      backPath="/brand/list"
    />
  );
}