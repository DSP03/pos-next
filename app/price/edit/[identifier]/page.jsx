"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/services/api";
import EditPage from "@/components/common/EditPage";

export default function PriceEdit() {
  const params = useParams();
  const router = useRouter();

  const identifier = params.identifier;

  const [priceData, setPriceData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (identifier) {
      loadPrice();
      loadProducts();
    }
  }, [identifier]);

  const loadPrice = async () => {
    try {
      const res = await api.get("/price/get", {
        params: { identifier },
      });

      setPriceData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await api.post("/product/list", {
        page: 0,
        sizePerPage: 100,
      });

      setProducts(res.data.dtoList || []);
    } catch (err) {
      console.log(err);
    }
  };

  if (!priceData) {
    return <div className="p-6">Loading...</div>;
  }

  const productMap = Object.fromEntries(
    products.map((p) => [p.identifier, p.productName])
  );

  return (
    <EditPage
      title="Edit Price"
      modelName="price"
      fields={[
        {
          name: "identifier",
          label: "Identifier",
          type: "text",
          disabled: true,
        },
        {
          name: "productName",
          label: "Product",
          type: "text",
          disabled: true,
        },
        {
          name: "priceType",
          label: "Price Type",
          type: "text",
          disabled: true,
        },
        {
          name: "value",
          label: "Value",
          type: "text",
          disabled: false,
          inputMode:"decimal",
        },
      ]}
      initialForm={{
        identifier: priceData.identifier || "",
        productName: productMap[priceData.productId] || "",
        priceType: priceData.priceType || "",
        value: priceData.value || "",
      }}
      validate={(form) => {
        if (!form.value && form.value !== 0) {
          return "Value is required";
        }

        if (Number.isNaN(Number(form.value)) || Number(form.value) <= 0) {
          return "Value must be a positive number";
        }

        return null;
      }}
      onSuccess={() => router.push("/price/list")}
      onCancel={() => router.push("/price/list")}
    />
  );
}