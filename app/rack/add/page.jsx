"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddPage from "@/components/common/AddPage";
import { getActiveShelves } from "@/components/common/DataDropdowns";

export default function RackAddPage() {
  const router = useRouter();

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
    <AddPage
      title="Add Rack"
      modelName="rack"
      fields={fields}
      initialForm={{
        name: "",
        shelfIdentifiers: [],
        status: true,
      }}
      validate={validate}
      onSuccess={() => router.push("/rack/list")}
      onCancel={() => router.push("/rack/list")}
    />
  );
}