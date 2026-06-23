"use client";

import EditPage from "@/components/common/EditPage";

export default function ShelfEditPage() {

  const fields = [
    {
      name: "name",
      label: "Shelf Name",
      type: "text",
    },
    {
      name: "status",
      label: "Status",
      type: "status",
    },
    ...AUDIT_FIELDS
  ];

  const validate = (form) => {
    const errors = {};

    if (!form.name?.trim()) {
      errors.name = "Shelf name is required";
    } else if (/\s/.test(form.name)) {
      errors.name = "Spaces are not allowed in shelf name";
    }

    return errors;
  };

  return (
    <EditPage
      modelName="shelf"
      title="Edit Shelf"
      fields={fields}
      initialForm={{
        identifier: "",
        name: "",
        status: true,
        createdBy: "",
        createdOn: "",
        modifiedBy: "",
        modifiedOn: "",
      }}
      readOnlyFields={[
        "name",
        "createdBy",
        "createdOn",
        "modifiedBy",
        "modifiedOn",
      ]}
      validate={validate}
      backPath="/shelf/list"
    />
  );
}