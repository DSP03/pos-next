"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AddPage from "@/components/common/AddPage";
import api from "@/services/api";

export default function PriceAdd() {
  const router = useRouter();

  const [options, setOptions] = useState({
    productId: [],
    priceType: [
      { identifier: "Selling Price", label: "Selling Price" },
      { identifier: "Cost Price", label: "Cost Price" },
      { identifier: "MRP", label: "MRP" },
    ],
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.post("/product/list", {
        page: 0,
        sizePerPage: 100,
      });

      setOptions((prev) => ({
        ...prev,
        productId: (res.data.dtoList || []).map((p) => ({
          identifier: p.identifier, label: p.productName, })),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AddPage
      title="Add Price"
      modelName="price"
      options={options}
      fields={[
        {name: "productId",label: "Product",type: "select",},
        {name: "priceType",label: "Price Type",type: "select",},
        {name: "value",label: "Value",type: "text",},
      ]}
      initialForm={{
        productId: "",
        priceType: "",
        value: "",
      }}
      validate={(form) => {
        if (!form.productId) return "Select product";
        if (!form.priceType) return "Select price type";
        if (!form.value) return "Price value required";
        return null;
      }}
      onSuccess={() => router.push("/price/list")}
      onCancel={() => router.push("/price/list")}
    />
  );
}