"use client";

import EditPage from "@/components/common/EditPage";

const fields = [
  { name: "modelName", label: "Model Name", type: "text", required: true, disabled: true },
  { status: true, name: "status", label: "Status", type: "status" },
];

const validate = (form) => {
  const errors = {};
  if (!form.modelName?.trim()) {
    errors.modelName = "Model name is required";
  }
  return errors;
};

const ModelsEditPage = () => {
  return (
    <EditPage
      modelName="models"
      title="Edit Model"
      fields={fields}
      initialForm={{ modelName: "", status: true }}
      validate={validate}
    />
  );
};

export default ModelsEditPage;