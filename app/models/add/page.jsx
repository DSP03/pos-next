"use client";

import { useRouter } from "next/navigation";
import AddPage from "@/components/common/AddPage";

const fields = [
  { name: "modelName", label: "Model Name", type: "text", required: true },
  { status: true, name: "status", label: "Status", type: "status" },
];

const validate = (form) => {
  const errors = {};
  if (!form.modelName?.trim()) {
    errors.modelName = "Model name is required";
  }
  return errors;
};

const ModelsAddPage = () => {
  const router = useRouter();

  return (
    <AddPage
      title="Add Model"
      modelName="models"
      fields={fields}
      initialForm={{ modelName: "", status: true }}
      validate={validate}
      onSuccess={() => router.push("/models/list")}
      onCancel={() => router.push("/models/list")}
    />
  );
};

export default ModelsAddPage;