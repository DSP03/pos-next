"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import api from "@/services/api";
import EditPage from "@/components/common/EditPage";
import {getBrands,getModels,getUnits,getCategories,} from "@/components/common/DataDropdowns";

const ProductEdit = () => {
  const router = useRouter();
  const params = useParams();

  const identifier = params.identifier;

  const [form, setForm] = useState(null);
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (identifier) {
      load();
      loadMaster();
    }
  }, [identifier]);

  const load = async () => {
    const res = await api.get("/product/get", {
      params: { identifier },
    });

    setForm(res.data);
  };

  const loadMaster = async () => {
    setOptions({
      brand: (await getBrands()).map((b) => ({
        identifier: b.identifier,label: b.brandName,})),

      model: (await getModels()).map((m) => ({
        identifier: m.identifier,label: m.modelName,})),

      unit: (await getUnits()).map((u) => ({
        identifier: u.identifier,label: u.unitName,})),

      categories: (await getCategories()).map((c) => ({
        identifier: c.identifier,label: c.name,})),
    });
  };

  if (!form) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <EditPage
      title="Edit Product"
      modelName="product"
      options={options}
      initialForm={form}
      fields={[
        {name: "identifier",label: "Identifier",type: "text",disabled: true,},
        {name: "productName",label: "Product Name",type: "text",},
        {name: "brand",label: "Brand",type: "select",},
        {name: "model",label: "Model",type: "select",},
        {name: "unit",label: "Unit",type: "select",},
        {name: "categories",label: "Categories",type: "multicheck",},
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
      onSuccess={() => router.push("/product/list")}
      onCancel={() => router.push("/product/list")}
    />
  );
};

export default ProductEdit;