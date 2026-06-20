"use client";

import { useEffect, useState } from "react";

import EditPage from "@/components/common/EditPage";
import { getRoles } from "@/components/common/DataDropdowns";

export default function NodeEdit() {
  const [options, setOptions] = useState({ roles: [] });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const roles = await getRoles();

      setOptions({
        roles: roles.map((r) => ({
          identifier: r.identifier,
          label: r.name || r.identifier,
        })),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <EditPage
      title="Edit Node"
      modelName="node"
      options={options}
      fields={[
        {
          name: "identifier",
          label: "Identifier",
          type: "text",
          disabled: true,
        },
        {
          name: "path",
          label: "Path",
          type: "text",
        },
        {
          name: "roles",
          label: "Roles",
          type: "multicheck",
        },
        {
          name: "createdBy",
          label: "Created By",
          type: "text",
          disabled: true,
        },
        {
          name: "createdOn",
          label: "Created On",
          type: "text",
          disabled: true,
        },
        {
          name: "modifiedBy",
          label: "Modified By",
          type: "text",
          disabled: true,
        },
        {
          name: "modifiedOn",
          label: "Modified On",
          type: "text",
          disabled: true,
        },
      ]}
      validate={(form) => {
        if (!form.path?.trim()) {
          return "Path is required";
        }

        if (!form.roles || form.roles.length === 0) {
          return "At least one role is required";
        }

        return null;
      }}
      backPath="/node/list"
    />
  );
}