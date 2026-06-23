"use client";

import CommonListModal from "@/components/common/CommonListModal";
import { validateCustomer } from "../utils/customerValidator";
import { CUSTOMER_CORE_FIELDS, CUSTOMER_INITIAL_FORM } from "../utils/CoreCustomerFields";

export default function CustomerList() {
  return (
    <CommonListModal
      modelName="customer"
      keys={[
        "identifier",
        "name",
        "phoneNo",
        "email",
        "partyType",
        "balance",
        "creditLimit",
      ]}
      enableToggle={true}
      addFields={CUSTOMER_CORE_FIELDS}
      addInitialForm={CUSTOMER_INITIAL_FORM}
      addValidate={validateCustomer}
    />
  );
}