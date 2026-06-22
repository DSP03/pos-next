"use client";

import CommonListPage from "@/components/common/CommonListPage";

const ShelfListPage = () => {
  return (
    <CommonListPage
      modelName="shelf"
      keys={["name"]}
      enableToggle={true}
    />
  );
};

export default ShelfListPage;