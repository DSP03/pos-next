"use client";

import { useRouter } from "next/navigation";
import AddPage from "@/components/common/AddPage";
import {
  WAREHOUSE_CORE_FIELDS,
  WAREHOUSE_INITIAL_FORM,
  validateWarehouse,
} from "../utils/WarehouseFields";


export default function WarehouseAddPage() {
  const router = useRouter();

  return (
    <AddPage
      title="Add Warehouse"
      modelName="warehouse"
      fields={WAREHOUSE_CORE_FIELDS}
      initialForm={WAREHOUSE_INITIAL_FORM}
      validate={validateWarehouse}
      onSuccess={() => router.push("/warehouse/list")}
      onCancel={() => router.push("/warehouse/list")}
    />
  );
}