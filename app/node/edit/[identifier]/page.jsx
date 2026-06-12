"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/services/api";
import EditPage from "@/components/common/EditPage";
import { getRoles } from "@/components/common/DataDropdowns";

const NodeEdit = () => {
  const params = useParams();
  const router = useRouter();

  const identifier = params.identifier;

  const [initialForm, setInitialForm] = useState(null);
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (identifier) {
      loadData();
    }
  }, [identifier]);

  const loadData = async () => {
    try {
      const nodeRes = await api.get("/node/get", {
        params: { identifier },
      });

      const roles = await getRoles();

      setOptions({roles: roles.map((r) => ({
          identifier: r.identifier,label: r.name || r.identifier,})),
      });
      setInitialForm({
        ...nodeRes.data,
        roles: Array.isArray(nodeRes.data.roles)
          ? nodeRes.data.roles: [],});
    } catch (err) {
      console.log(err);
      alert("Failed to load node");
    }
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
      title="Edit Node"
      modelName="node"
      initialForm={initialForm}
      options={options}
      fields={[
        { name: "identifier", label: "Identifier", type: "text", disabled: true },
        { name: "path", label: "Path", type: "text" },
        { name: "roles", label: "Roles", type: "multicheck" },
      ]}
      validate={(form) => {
        if (!form.path?.trim()) return "Path is required";
        if (!form.roles || form.roles.length === 0) 
          return "At least one role is required";
        return null;
      }}
      onSuccess={() => router.push("/node/list")}
      onCancel={() => router.push("/node/list")}
    />
  );
};

export default NodeEdit;