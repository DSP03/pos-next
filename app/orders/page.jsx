"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Layout from "@/components/common/Layout";
import { ShoppingCart, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import PageGuard from "@/components/common/PageGuard";

const currency = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const SIZE_PER_PAGE = 5;

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");

  const fetchOrders = async (pageToFetch) => {
    setLoading(true);
    try {
      const res = await api.post("/order/list", {
        page: pageToFetch,
        sizePerPage: SIZE_PER_PAGE,
        sortDirection: "DESC",
        sortfield: "createdOn",
      });

      setOrders(res.data?.dtoList || []);
      setTotalPages(res.data?.totalPages ?? 0);
      setTotalRecords(res.data?.totalRecords ?? 0);
    } catch (err) {
      console.error("Order list error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      fetchOrders(page);
    }
  }, [page]);

  const goToPrevious = () => setPage((p) => Math.max(0, p - 1));
  const goToNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const rangeStart = page * SIZE_PER_PAGE + 1;
  const rangeEnd = Math.min(totalRecords, rangeStart + orders.length - 1);

  const searchOrders = async (value) => {
    try {
      if (!value.trim()) {
        fetchOrders(page);
        return;
      }

      setLoading(true);
      const res = await api.get("/order/search", {
        params: {
          query: value,
        },
      });

      setOrders(res.data || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      searchOrders(search);
    }, 350);

    return () => clearTimeout(handle);
  }, [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const isSearching = search.trim().length > 0;

  let orderRows;

  if (loading) {
    orderRows = (
      <tr>
        <td colSpan="7" className="p-6 text-center text-gray-400">
          Loading...
        </td>
      </tr>
    );
  } else if (orders.length === 0) {
    orderRows = (
      <tr>
        <td colSpan="7" className="p-6 text-center text-gray-400">
          {isSearching ? "No orders match your search" : "No orders found"}
        </td>
      </tr>
    );
  } else {
    orderRows = orders.map((o) => (
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
    ));
  }

  return (
    <PageGuard>
      <Layout>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="bg-red-600 text-white p-5 rounded-2xl mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Orders</h1>
                <p className="text-sm text-red-100">
                  All placed orders
                </p>
              </div>

              <button
                onClick={() => router.push("/cart")}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >
                <ShoppingCart size={16} />
                Cart
              </button>
            </div>

            {/* Search */}
            <div className="bg-white border rounded-2xl mb-6 p-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by order ID or customer"
                  className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />
                {search && (
                  <button
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
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
                  {orderRows}
                </tbody>
              </table>

              {/* Pagination footer (hidden during search since /order/search isn't paginated) */}
              {!loading && !isSearching && totalRecords > 0 && (
                <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-500">
                  <span>
                    Showing {rangeStart}–{rangeEnd} of {totalRecords}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPrevious}
                      disabled={page === 0}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} />
                      Prev
                    </button>

                    <span className="text-gray-700 font-medium">
                      Page {page + 1} of {Math.max(totalPages, 1)}
                    </span>

                    <button
                      onClick={goToNext}
                      disabled={page + 1 >= totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Result count during search */}
              {!loading && isSearching && (
                <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-500">
                  <span>{orders.length} result{orders.length === 1 ? "" : "s"} for "{search}"</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </Layout>
    </PageGuard>
  );
}