"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddPage from "@/components/common/AddPage";
import { getActiveShelves } from "@/components/common/DataDropdowns";
import {
  getRackFields,
  RACK_INITIAL_FORM,
  validateRack,
} from "../utils/RackCoreFields";

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

  return (
    <AddPage
      title="Add Rack"
      modelName="rack"
      fields={getRackFields(shelfOptions)}
      initialForm={RACK_INITIAL_FORM}
      validate={validateRack}
      onSuccess={() => router.push("/rack/list")}
      onCancel={() => router.push("/rack/list")}
    />
  );
}