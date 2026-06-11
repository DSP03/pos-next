"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditPage from "@/components/common/EditPage";
import api from "@/services/api";

export default function CategoryEdit() {

  const router = useRouter();
  const [options, setOptions] = useState({ superCategoryIdentifier: [] });

  useEffect(() => {
    loadSuperCategories();
  }, []);

  const loadSuperCategories = async () => {
    try {
      const res = await api.get("/category/super");
      setOptions({
        superCategoryIdentifier:
          res.data?.map((c) => ({ identifier: c.identifier, label: c.name })) || []
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fields = [
    { name: "identifier", label: "Identifier",     type: "text",   disabled: true },
    { name: "name",       label: "Category Name",  type: "text" },
    { name: "superCategoryIdentifier", label: "Parent Category", type: "select" }
  ];

  const validate = (form) => {
    if (!form.name?.trim()) return "Category Name is required";
    return null;
  };

  return (
    <EditPage
      title="Edit Category"
      modelName="category"
      fields={fields}
      options={options}
      initialForm={{ identifier: "", name: "", superCategoryIdentifier: "" }}
      validate={validate}
      onSuccess={() => router.push("/category/list")}
      onCancel={() => router.push("/category/list")}
    />
  );
}