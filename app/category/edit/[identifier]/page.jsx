"use client";

import { useEffect, useState } from "react";
import EditPage from "@/components/common/EditPage";
import api from "@/services/api";
import { AUDIT_FIELDS } from "@/components/common/AuditFields";

export default function CategoryEdit() {
  const [options, setOptions] = useState({
    superCategoryIdentifier: [],
  });

  useEffect(() => {
    loadSuperCategories();
  }, []);

  const loadSuperCategories = async () => {
    try {
      const res = await api.get("/category/super");

      setOptions({
        superCategoryIdentifier:
          res.data?.map((c) => ({
            identifier: c.identifier,
            label: c.name,
          })) || [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <EditPage
      title="Edit Category"
      modelName="category"
      options={options}
      fields={[
        {
          name: "identifier",
          label: "Identifier",
          type: "text",
          disabled: true,
        },
        {
          name: "name",
          label: "Category Name",
          type: "text",
        },
        {
          name: "superCategoryIdentifier",
          label: "Parent Category",
          type: "select",
        },
        ...AUDIT_FIELDS,
      ]}
      validate={(form) => {
        if (!form.name?.trim()) {
          return "Category Name is required";
        }

        return null;
      }}
      backPath="/category/list"
    />
  );
}