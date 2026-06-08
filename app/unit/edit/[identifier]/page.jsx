"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import EditPage from "@/components/common/EditPage";
import api from "@/services/api";

export default function UnitEdit() {
  const { identifier } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);

  useEffect(() => {loadUnit();}, []);

  const loadUnit = async () => {
    try {
      const res = await api.get(`/unit/get?identifier=${identifier}`);
      setForm(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!form) {
    return (
      <div className="p-5">
        Loading...
      </div>
    );
  }

  return (
    <EditPage
      title="Edit Unit"
      modelName="unit"
      initialForm={form}
      fields={[
        {name: "identifier",label: "Identifier",type: "text",disabled: true},
        {name: "unitName",label: "Unit Name",type: "text",disabled: true},
        {name: "status",label: "Status",type: "status"}
      ]}
      onSuccess={() => router.push("/unit/list")}
      onCancel={() => router.push("/unit/list")}
    />
  );
}