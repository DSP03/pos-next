"use client";

import { useEffect, useState } from "react";
import EditPage from "@/components/common/EditPage";
import { AUDIT_FIELDS } from "@/components/common/AuditFields";
import { getActiveShelves } from "@/components/common/DataDropdowns";
import {getRackFields,RACK_INITIAL_FORM,validateRack,} from "../../utils/RackCoreFields";

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
    ...getRackFields(shelfOptions),
    ...AUDIT_FIELDS,
  ];

  return (
    <EditPage
      modelName="rack"
      title="Edit Rack"
      fields={fields}
      initialForm={{
        ...RACK_INITIAL_FORM,
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
      validate={validateRack}
      backPath="/rack/list"
    />
  );
}