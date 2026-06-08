"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddPage from "@/components/common/AddPage";
import api from "@/services/api";

export default function CategoryAdd() {

  const router = useRouter();
  const [options, setOptions] = useState({superCategoryIdentifier: []});

  useEffect(() => {loadSuperCategories();}, []);

  const loadSuperCategories = async () => {
    try {
      const res = await api.get("/category/super");
      setOptions({
        superCategoryIdentifier:res.data?.map((c) => ({
            identifier: c.identifier,label: c.name})) || []
      });

    } catch (err) {
      console.log(err);
    }
  };

  const fields = [
    {name: "identifier",label: "Identifier",type: "text"},
    {name: "name",label: "Category Name",type: "text"},
    {name: "superCategoryIdentifier",label: "Parent Category",type: "select"}
  ];

  const initialForm = {
    identifier: "",
    name: "",
    superCategoryIdentifier: ""
  };

  const validate = (form) => {

    if (!form.identifier?.trim()) {
      return "Identifier is required";
    }

    if (!form.name?.trim()) {
      return "Category Name is required";
    }

    return null;
  };

  return (
    <AddPage
      title="Add Category"
      modelName="category"
      fields={fields}
      options={options}
      initialForm={initialForm}
      validate={validate}
      onSuccess={() => router.push("/category/list")}
      onCancel={() => router.push("/category/list")}
    />
  );
}