"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import EditPage from "@/components/common/EditPage";
import api from "@/services/api";

export default function BrandEdit() {

  const { identifier } = useParams();
  const router = useRouter();
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {

    if (identifier) {
      loadBrand();
    }

  }, [identifier]);

  const loadBrand = async () => {

    try {

      const res = await api.get(
        `/brand/get?identifier=${identifier}`
      );

      setInitialForm({
        identifier: res.data.identifier || "",
        brandName: res.data.brandName || "",
        description: res.data.description || "",
        status: res.data.status ?? true
      });

    } catch (err) {

      console.error(err);

    }
  };

  const fields = [
    {name: "identifier",label: "Identifier",type: "text",disabled: true},
    {name: "brandName",label: "Brand Name",type: "text",disabled: true},
    {name: "description",label: "Description",type: "textarea"},
    {name: "status",label: "Status",type: "status"}
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
      initialForm={initialForm}
      validate={validate}
      onSuccess={() => router.push("/brand/list")}
      onCancel={() => router.push("/brand/list")}
    />
  );
}