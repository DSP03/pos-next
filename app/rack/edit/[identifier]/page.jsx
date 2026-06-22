"use client";

import { useEffect, useState } from "react";
import EditPage from "@/components/common/EditPage";
import { getActiveShelves } from "@/components/common/DataDropdowns";

export default function RackEditPage() {

  const [shelfOptions, setShelfOptions] = useState([]);

  useEffect(() => {
    loadShelves();
  }, []);

  const loadShelves = async () => {
    try {
      const shelves = await getActiveShelves();

      setShelfOptions(
        shelves.map((shelf) => ({
          value: shelf.identifier,
          label: shelf.name,
        }))
      );
    } catch (err) {
      console.error("Failed to load shelves", err);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Rack Name",
      type: "text",
    },
    {
      name: "shelfIdentifiers",
      label: "Shelves",
      type: "multicheck",
      options: shelfOptions,
    },
    {
      name: "status",
      label: "Status",
      type: "status",
    },
    {
      name: "createdBy",
      label: "Created By",
      type: "text",
    },
    {
      name: "createdOn",
      label: "Created On",
      type: "text",
    },
    {
      name: "modifiedBy",
      label: "Modified By",
      type: "text",
    },
    {
      name: "modifiedOn",
      label: "Modified On",
      type: "text",
    },
  ];

  const validate = (form) => {
    const errors = {};

    if (!form.name?.trim()) {
      errors.name = "Rack name is required";
    } else if (/\s/.test(form.name)) {
      errors.name = "Spaces are not allowed in rack name";
    }

    return errors;
  };

  return (
    <EditPage
      modelName="rack"
      title="Edit Rack"
      fields={fields}
      initialForm={{
        identifier: "",
        name: "",
        shelfIdentifiers: [],
        status: true,
        createdBy: "",
        createdOn: "",
        modifiedBy: "",
        modifiedOn: "",
      }}
      readOnlyFields={[
        "name",
        "createdBy",
        "createdOn",
        "modifiedBy",
        "modifiedOn",
      ]}
      validate={validate}
      backPath="/rack/list"
    />
  );
}