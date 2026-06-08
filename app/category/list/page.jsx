"use client";

import SimpleListPage from "@/components/common/SimpleListPage";

const CategoryList = () => {
  return (
    <SimpleListPage
      modelName="category"
      keys={["identifier","name","superCategoryIdentifier"]}
    />
  );
};

export default CategoryList;