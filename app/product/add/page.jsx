"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AddPage from "@/components/common/AddPage";
import {
  getBrands,
  getModels,
  getUnits,
  getCategories,
} from "@/components/common/DataDropdowns";

const ProductAdd = () => {
  const router = useRouter();

  const [options, setOptions] = useState({});

  useEffect(() => {
    loadMaster();
  }, []);

  const loadMaster = async () => {
    setOptions({
      brand: (await getBrands()).map((b) => ({
        identifier: b.identifier,
        label: b.brandName,
      })),
      model: (await getModels()).map((m) => ({
        identifier: m.identifier,
        label: m.modelName,
      })),
      unit: (await getUnits()).map((u) => ({
        identifier: u.identifier,
        label: u.unitName,
      })),
      categories: (await getCategories()).map((c) => ({
        identifier: c.identifier,
        label: c.name,
      })),
    });
  };

  return (
    <AddPage
      title="Add Product"
      modelName="product"
      initialForm={{
        identifier: "",
        productName: "",
        brand: "",
        model: "",
        unit: "",
        categories: [],
      }}
      options={options}
      fields={[
        { name: "identifier", label: "Identifier", type: "text" },
        { name: "productName", label: "Product Name", type: "text" },
        { name: "brand", label: "Brand", type: "select" },
        { name: "model", label: "Model", type: "select" },
        { name: "unit", label: "Unit", type: "select" },
        { name: "categories", label: "Categories", type: "multicheck" },
      ]}
      validate={(form) => {
        if (!form.identifier) return "Identifier required";
        if (!form.productName?.trim()) return "Product name required";
        if (!form.brand) return "Brand required";
        if (!form.model) return "Model required";
        if (!form.unit) return "Unit required";
        if (!form.categories.length)
          return "Select at least one category";

        return null;
      }}
      onSuccess={() => router.push("/product/list")}
      onCancel={() => router.push("/product/list")}
    />
  );
};

export default ProductAdd;