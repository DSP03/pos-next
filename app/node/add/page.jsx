"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AddPage from "@/components/common/AddPage";
import { getRoles } from "@/components/common/DataDropdowns";

const NodeAdd = () => {
  const router = useRouter();

  const [options, setOptions] = useState({});

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const roles = await getRoles();

      setOptions({
        roles: roles.map((r) => ({
          identifier: r.identifier,
          label: r.name || r.identifier,
        })),
      });
    } catch (err) {
      console.log("ROLE LOAD ERROR:", err);
    }
  };

  return (
    <AddPage
      title="Add Node"
      modelName="node"
      initialForm={{
        identifier: "",
        path: "",
        roles: [],
      }}
      fields={[
        { name: "identifier", label: "Identifier", type: "text" },
        { name: "path", label: "Path", type: "text" },
        { name: "roles", label: "Roles", type: "multicheck" },
      ]}
      options={options}
      validate={(form) => {
        if (!form.identifier) return "Identifier is required";
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

export default NodeAdd;