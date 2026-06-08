"use client";

import { useRouter } from "next/navigation";
import AddPage from "@/components/common/AddPage";

export default function UnitAdd() {
  const router = useRouter();

  return (
    <AddPage
      title="Add Unit"
      modelName="unit"
      initialForm={{
        unitName: "",
        status: true
      }}
      fields={[
        {name: "unitName",label: "Unit Name",type: "text"},
        {name: "status",label: "Status",type: "status"}
      ]}
      validate={(form) => {
        if (!form.unitName?.trim()) {
          return "Unit Name is required";
        }
        return "";
      }}
      onSuccess={() => router.push("/unit/list")}
      onCancel={() => router.push("/unit/list")}
    />
  );
}