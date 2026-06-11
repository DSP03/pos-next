"use client";

import { useRouter } from "next/navigation";
import AddPage from "@/components/common/AddPage";
export default function RoleAdd() {

  const router = useRouter();
  const fields = [
    {name: "identifier",label: "Identifier",type: "text"},
    {name: "description",label: "Description",type: "textarea"}
  ];

  const initialForm = {identifier: "",description: ""};
  const validate = (form) => {
    if (!form.identifier?.trim()) {
      return "Identifier is required";
    }
    if (!form.description?.trim()) {
      return "Description is required";
    }
    return null;
  };

  return (
    <AddPage
      title="Add Role"
      modelName="role"
      fields={fields}
      initialForm={initialForm}
      validate={validate}
      onSuccess={() => router.push("/role/list")}
      onCancel={() => router.push("/role/list")}
    />
  );
}