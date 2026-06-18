"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AddPage from "@/components/common/AddPage";
import { getPriceTypes } from "@/components/common/DataDropdowns";
import api from "@/services/api";

export default function PriceAdd() {
  const router = useRouter();

  const [options, setOptions] = useState({
    productId: [],
    priceType: [],
  });

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [productRes, priceTypes] = await Promise.all([
        api.post("/product/list", {
          page: 0,
          sizePerPage: 100,
        }),
        getPriceTypes(),
      ]);

      setOptions({
        productId: (productRes.data.dtoList || []).map((p) => ({
          identifier: p.identifier,
          label: p.productName,
        })),
        priceType: priceTypes,
      });
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
        {
          name: "productId",
          label: "Product",
          type: "select",
        },
        {
          name: "priceType",
          label: "Price Type",
          type: "select",
        },
        {
          name: "value",
          label: "Value",
          type: "text",
        },
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