"use client";

import { useRouter } from "next/navigation";
import AddPage from "@/components/common/AddPage";

export default function WarehouseAddPage() {
  const router = useRouter();

  const fields = [
    {
      name: "identifier",
      label: "Warehouse Code",
      type: "text",
    },
    {
      name: "warehouseName",
      label: "Warehouse Name",
      type: "text",
    },
    {
      name: "country",
      label: "Country",
      type: "text",
    },
    {
      name: "state",
      label: "State",
      type: "text",
    },
    {
      name: "cityName",
      label: "City",
      type: "text",
    },
    {
      name: "location",
      label: "Location",
      type: "textarea",
    },
  ];

  const validate = (form) => {
    const errors = {};

    if (!form.identifier?.trim()) {
    errors.identifier = "Warehouse code is required";
    } else if (/\s/.test(form.identifier)) {
    errors.identifier = "Spaces are not allowed in warehouse code";
    }
    
    if (!form.warehouseName?.trim()) {
      errors.warehouseName = "Warehouse name is required";
    }

    if (!form.country?.trim()) {
      errors.country = "Country is required";
    }

    if (!form.state?.trim()) {
      errors.state = "State is required";
    }

    if (!form.cityName?.trim()) {
      errors.cityName = "City is required";
    }

    if (!form.location?.trim()) {
      errors.location = "Location is required";
    }

    return errors;
  };

  return (
    <AddPage
      title="Add Warehouse"
      modelName="warehouse"
      fields={fields}
      initialForm={{
        identifier: "",
        warehouseName: "",
        country: "",
        state: "",
        cityName: "",
        location: "",
      }}
      validate={validate}
      onSuccess={() => router.push("/warehouse/list")}
      onCancel={() => router.push("/warehouse/list")}
    />
  );
}