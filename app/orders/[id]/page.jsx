"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ClipboardList, Printer } from "lucide-react";
import api from "@/services/api";
import Layout from "@/components/common/Layout";
import PageGuard from "@/components/common/PageGuard";
import { printElement } from "@/utils/print";
import { STORE } from "@/config/store";

const currency = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/order/get?identifier=${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handlePrint = () => {
    printElement(printRef, { title: `Invoice ${id}` });
  };

  return (
    <PageGuard>
      <Layout>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="bg-red-600 text-white p-5 rounded-2xl mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Order Details</h1>
                <p className="text-sm">{id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  disabled={!order}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-40"
                >
                  <Printer size={16} />
                  Print
                </button>

                <button
                  onClick={() => router.push("/cart")}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  <ShoppingCart size={16} />
                  Cart
                </button>

                <button
                  onClick={() => router.push("/orders")}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  <ClipboardList size={16} />
                  Orders
                </button>
              </div>
            </div>

            {(() => {
              if (loading) return <p className="text-center text-gray-400">Loading...</p>;
              if (!order) return <p className="text-center text-gray-400">Order not found</p>;
              return (
                <div ref={printRef} className="bg-white p-6 rounded-2xl border space-y-6">

                {/* STORE / BILL HEADER */}
                <div className="text-center border-b pb-4">
                  {STORE.logoUrl && (
                    <img src={STORE.logoUrl} alt={STORE.name} className="h-12 mx-auto mb-2" />
                  )}
                  <h2 className="text-xl font-bold uppercase tracking-wide">{STORE.name}</h2>
                  <p className="text-xs text-gray-500">{STORE.addressLine1}</p>
                  <p className="text-xs text-gray-500">{STORE.addressLine2}</p>
                  <p className="text-xs text-gray-500">
                    {STORE.phone && `Ph: ${STORE.phone}`}
                    {STORE.email && ` | ${STORE.email}`}
                  </p>
                  {STORE.gstin && (
                    <p className="text-xs text-gray-500">GSTIN: {STORE.gstin}</p>
                  )}
                  <p className="mt-3 text-sm font-semibold tracking-widest uppercase">
                    Tax Invoice
                  </p>
                </div>

                {/* INVOICE META */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    Invoice No: <span className="font-semibold text-gray-800">{id}</span>
                  </span>
                  <span>
                    Date:{" "}
                    <span className="font-semibold text-gray-800">
                      {order.createdOn
                        ? new Date(order.createdOn).toLocaleDateString("en-GB")
                        : new Date().toLocaleDateString("en-GB")}
                    </span>
                  </span>
                </div>

                {/* ORDER HEADER */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="font-semibold">{order.customer}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Billed By</p>
                    <p className="font-semibold">{order.createdBy || "—"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Payment</p>
                    <p className="font-semibold">{order.paymentMethod}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-semibold">{currency(order.totalPrice)}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Discount</p>
                    <p className="font-semibold text-green-600">
                      {currency(order.discount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Received</p>
                    <p className="font-semibold">
                      {currency(order.receivedAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Change</p>
                    <p className="font-semibold text-green-600">
                      {currency(order.changeAmount)}
                    </p>
                  </div>
                </div>

                {/* ORDER ENTRY TABLE */}
                <div className="border-t pt-4">
                  <h2 className="font-semibold mb-3">Items</h2>

                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Product</th>
                        <th className="p-2">MRP</th>
                        <th className="p-2">Unit Price</th>
                        <th className="p-2">Discount</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.entryList?.map((e) => (
                        <tr key={e.identifier} className="border-t">
                          <td className="p-2">{e.product}</td>
                          <td className="p-2 text-center">{currency(e.mrp)}</td>
                          <td className="p-2 text-center">{currency(e.unitPrice)}</td>
                          <td className="p-2 text-center text-green-600">
                            {currency(e.unitDiscount)}
                          </td>
                          <td className="p-2 text-center">{e.quantity}</td>
                          <td className="p-2 text-center font-semibold">
                            {currency(e.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* BILL FOOTER */}
                <div className="border-t pt-4 text-center text-xs text-gray-400">
                  <p>Thank you for shopping with us!</p>
                  <p className="mt-1">
                    This is a computer-generated invoice and does not require a signature.
                  </p>
                </div>
              </div>
              );
            })()}
          </div>
        </div>
      </Layout>
    </PageGuard>
  );
}