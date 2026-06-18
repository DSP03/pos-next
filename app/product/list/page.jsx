"use client";

import CommonListPage from "@/components/common/CommonListPage";

const ProductList = () => {
  return (
    <CommonListPage
      modelName="product"
      keys={[
        "identifier",
        "productName",
        "brand",
        "model",
        "categories",
        "unit"
      ]}
      enableToggle={true}
    />
  );
};

export default ProductList;