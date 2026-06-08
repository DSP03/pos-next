"use client";

import { useRouter } from "next/navigation";
import AddPage from "@/components/common/AddPage";
export default function BrandAdd() {

  const router = useRouter();

  const fields = [
    {name: "brandName",label: "Brand Name",type: "text"},
    {name: "description",label: "Description",type: "textarea"},
    {name: "status",label: "Status",type: "status"}
  ];

  const initialForm = {brandName: "",description: "",status: true};

  const validate = (form) => {

    if (!form.brandName?.trim()) {
      return "Brand Name is required";
    }

    return null;
  };

  return (
    <AddPage
      title="Add Brand"
      modelName="brand"
      fields={fields}
      initialForm={initialForm}
      validate={validate}
      onSuccess={() => router.push("/brand/list")}
      onCancel={() => router.push("/brand/list")}
    />
  );
}