"use client";

import { useRouter } from "next/navigation";
import AddPage from "@/components/common/AddPage";

export default function ShelfAddPage() {
  const router = useRouter();

  const fields = [
    {name: "name",label: "Shelf Name",type: "text",required: true,},
    {name: "status",label: "Status",type: "status",required: true,},
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
    <AddPage
      title="Add Shelf"
      modelName="shelf"
      fields={fields}
      initialForm={{
        name: "",
        status: true,
      }}
      validate={validate}
      onSuccess={() => router.push("/shelf/list")}
      onCancel={() => router.push("/shelf/list")}
    />
  );
}