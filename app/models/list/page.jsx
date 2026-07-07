"use client";

import CommonListPage from "@/components/common/CommonListPage";

const ModelsPage = () => {
  return (
    <CommonListPage
      modelName="models"
      keys={["modelName", "createdBy", "createdOn"]}
      enableToggle={true}
      sizePerPage={10}
    />
  );
};

export default ModelsPage;