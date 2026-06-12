"use client";

import CommonListPage from "@/components/common/CommonListPage";

const CategoryList = () => {
  return (
    <CommonListPage
      modelName="category"
      keys={["identifier","name","superCategoryIdentifier"]}
    />
  );
};

export default CategoryList;