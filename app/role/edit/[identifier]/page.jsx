"use client";

import EditPage from "@/components/common/EditPage";

export default function RoleEdit() {
  const fields = [
    {
      name: "identifier",
      label: "Identifier",
      type: "text",
      disabled: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
    {
      name: "createdBy",
      label: "Created By",
      type: "text",
      disabled: true,
    },
    {
      name: "createdOn",
      label: "Created On",
      type: "text",
      disabled: true,
    },
    {
      name: "modifiedBy",
      label: "Modified By",
      type: "text",
      disabled: true,
    },
    {
      name: "modifiedOn",
      label: "Modified On",
      type: "text",
      disabled: true,
    },
  ];

  const validate = (form) => {
    if (!form.description?.trim()) {
      return "Description is required";
    }

    return null;
  };

  return (
    <EditPage
      title="Edit Role"
      modelName="role"
      fields={fields}
      validate={validate}
      backPath="/role/list"
    />
  );
}