"use client";

import EditPage from "@/components/common/EditPage";
import { AUDIT_FIELDS } from "@/components/common/AuditFields";
import {
  WAREHOUSE_CORE_FIELDS,
  WAREHOUSE_INITIAL_FORM,
  validateWarehouse,
} from "../utils/WarehouseCoreFields";

const WAREHOUSE_FIELDS = [
  ...WAREHOUSE_CORE_FIELDS,
  ...AUDIT_FIELDS,
];

export default function WarehouseEditPage() {
  return (
    <EditPage
      modelName="warehouse"
      title="Edit Warehouse"
      fields={WAREHOUSE_FIELDS}
      initialForm={{
        ...WAREHOUSE_INITIAL_FORM,
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
      validate={validateWarehouse}
      backPath="/warehouse/list"
    />
  );
}