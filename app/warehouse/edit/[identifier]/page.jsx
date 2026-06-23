"use client";

import { AUDIT_FIELDS } from "@/components/common/AuditFields";
import EditPage from "@/components/common/EditPage";

export default function WarehouseEditPage() {
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
    ...AUDIT_FIELDS
  ];

  const validate = (form) => {
    const errors = {};

    if (!form.identifier?.trim()) {
      errors.identifier = "Warehouse code is required";
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
    <EditPage
      modelName="warehouse"
      title="Edit Warehouse"
      fields={fields}
      initialForm={{
        identifier: "",
        warehouseName: "",
        country: "",
        state: "",
        cityName: "",
        location: "",
        createdBy: "",
        createdOn: "",
        modifiedBy: "",
        modifiedOn: "",
      }}
      readOnlyFields={[
        "identifier",
        "createdBy",
        "createdOn",
        "modifiedBy",
        "modifiedOn",
      ]}
      validate={validate}
      backPath="/warehouse/list"
    />
  );
}