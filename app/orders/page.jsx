"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Layout from "@/components/common/Layout";
import PageGuard from "@/components/common/PageGuard";

const currency = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.post("/order/list", {
        page: 0,
        sizePerPage: 50,
        sortDirection: "DESC",
        sortfield: "createdDate",
      });

      setOrders(res.data?.dtoList || []);
    } catch (err) {
      console.error("Order list error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <PageGuard>
      <Layout>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="bg-red-600 text-white p-5 rounded-2xl mb-6">
              <h1 className="text-xl font-bold">Orders</h1>
              <p className="text-sm text-red-100">
                All placed orders
              </p>
            </div>

            {/* Table */}
            <div className="bg-white border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-red-700">
                  <tr>
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Payment</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">Received</th>
                    <th className="p-3 text-left">Change</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-gray-400">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.identifier} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">{o.identifier}</td>
                        <td className="p-3">{o.customer}</td>
                        <td className="p-3">{o.paymentMethod}</td>
                        <td className="p-3 font-semibold">{currency(o.totalPrice)}</td>
                        <td className="p-3">{currency(o.receivedAmount)}</td>
                        <td className="p-3 text-green-600">
                          {currency(o.changeAmount)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => router.push(`/orders/${o.identifier}`)}
                            className="text-red-600 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </Layout>
    </PageGuard>
  );
}