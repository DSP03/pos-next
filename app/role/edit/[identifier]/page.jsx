"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import EditPage from "@/components/common/EditPage";
import api from "@/services/api";

export default function RoleEdit() {

  const params = useParams();
  const router = useRouter();
  const identifier = params?.identifier ? 
             decodeURIComponent(params.identifier): "";
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    if (identifier) {
      loadRole();
    }
  }, [identifier]);

  const loadRole = async () => {
    try {

      console.log("Identifier:", identifier);

      const res = await api.get("/role/get", {
        params: {
          identifier: identifier,
        },
      });

      setInitialForm({
        identifier: res.data.identifier || "",
        description: res.data.description || "",
      });
    } catch (err) {
      console.log("ROLE LOAD ERROR:", err);
      alert("Failed to load role");
    }
  };

  const fields = [
    {
      name: "identifier",
      label: "Identifier",
      type: "text",
      disabled: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
  ];

  const validate = (form) => {
    if (!form.description?.trim()) {
      return "Description is required";
    }

    return null;
  };

  if (!initialForm) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <EditPage
      title="Edit Role"
      modelName="role"
      fields={fields}
      initialForm={initialForm}
      validate={validate}
      onSuccess={() => router.push("/role/list")}
      onCancel={() => router.push("/role/list")}
    />
  );
}