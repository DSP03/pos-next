"use client";

import { useEffect, useState } from "react";
import EditPage from "@/components/common/EditPage";
import {
  getBrands,
  getModels,
  getUnits,
  getCategories,
} from "@/components/common/DataDropdowns";

const ProductEdit = () => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    loadMaster();
  }, []);

  const loadMaster = async () => {
    const [brands, models, units, categories] = await Promise.all([
      getBrands(),
      getModels(),
      getUnits(),
      getCategories(),
    ]);

    setOptions({
      brand: brands.map((b) => ({
        identifier: b.identifier,
        label: b.brandName,
      })),
      model: models.map((m) => ({
        identifier: m.identifier,
        label: m.modelName,
      })),
      unit: units.map((u) => ({
        identifier: u.identifier,
        label: u.unitName,
      })),
      categories: categories.map((c) => ({
        identifier: c.identifier,
        label: c.name,
      })),
    });
  };

  if (!options) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <EditPage
      title="Edit Product"
      modelName="product"
      options={options}
      fields={[
        { name: "identifier", label: "Identifier", type: "text", disabled: true },
        { name: "productName", label: "Product Name", type: "text" },
        { name: "status", label: "Status", type: "status" },
        { name: "brand", label: "Brand", type: "select" },
        { name: "model", label: "Model", type: "select" },
        { name: "unit", label: "Unit", type: "select" },
        { name: "categories", label: "Categories", type: "multicheck" },
        { name: "createdBy", label: "Created By", type: "text", disabled: true },
        { name: "createdOn", label: "Created On", type: "text", disabled: true },
        { name: "modifiedBy", label: "Modified By", type: "text", disabled: true },
        { name: "modifiedOn", label: "Modified On", type: "text", disabled: true },
      ]}
      validate={(form) => {
        if (!form.identifier) return "Identifier required";
        if (!form.productName?.trim()) return "Product name required";
        if (!form.brand) return "Brand required";
        if (!form.model) return "Model required";
        if (!form.unit) return "Unit required";
        if (!form.categories?.length)
          return "Select at least one category";

        return null;
      }}
      backPath="/product/list"
    />
  );
};

export default ProductEdit;