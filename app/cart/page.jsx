"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ShoppingCart, RefreshCw } from "lucide-react";
import api from "@/services/api";
import PropTypes from "prop-types";
import Layout from "@/components/common/Layout";
import CustomerSelect from "@/components/common/CustomerSelect";
import ProductSelect from "@/components/common/ProductSelect";
import PageGuard from "@/components/common/PageGuard";

const today = () =>
  new Date().toLocaleDateString("en-GB").replaceAll("/", "-");

const currency = (val) =>
  `₹${Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const Field = ({ label, children }) => (
  <div className="border border-[#D9E5E7] rounded-lg px-4 pt-2 pb-2.5">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    {children}
  </div>
);

const CartTable = ({ entries, onQtyChange, onRemove }) => (
  <div className="overflow-x-auto rounded-2xl border border-[#D9E5E7] mt-4">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-[#D9E5E7] bg-[#F2F7F8]">
          {["Product", "Code", "MRP", "Selling Price","Discount", "Qty", "Subtotal", ""].map((h) => (
            <th key={h} className="px-4 py-3 text-left font-semibold text-red-700">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {entries.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
              No items yet — select a product above to begin.
            </td>
          </tr>
        ) : (
          entries.map((entry, i) => (
            <tr key={entry.identifier ?? i} className="border-b border-[#D9E5E7] hover:bg-red-50">
              <td className="px-4 py-3 font-medium text-gray-900">{entry.productId}</td>
              <td className="px-4 py-3 text-gray-500 font-mono text-xs">{entry.identifier}</td>
              <td className="px-4 py-3 text-gray-400 line-through">{currency(entry.mrp)}</td>
              <td className="px-4 py-3 text-gray-700">{currency(entry.sellingPrice)}</td>
              <td className="px-4 py-3 text-gray-700">{currency(entry.discount)}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  min={1}
                  value={entry.quantity}
                  onChange={(e) => onQtyChange(i, e.target.value)}
                  className="w-16 rounded-lg border border-[#D9E5E7] px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900">
                {currency(entry.totalPrice)}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onRemove(i)}
                  title="Remove item"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const TotalsRow = ({ label, value, green, bold }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span
      className={[
        green ? "text-green-600" : "text-gray-900",
        bold ? "font-bold text-base" : "",
      ].join(" ")}
    >
      {value}
    </span>
  </div>
);

const CartTotals = ({ cart, onRecalculate, recalculating }) => (
  <div className="flex justify-end mt-6">
    <div className="w-80 space-y-3 text-sm bg-white border border-red-100 rounded-xl p-4 shadow-sm">
      <TotalsRow label="Original Price" value={currency(cart?.originalPrice)} />
      <TotalsRow label="Discount" value={`- ${currency(cart?.discount)}`} green />
      <div className="border-t border-[#D9E5E7] pt-2 flex items-center justify-between">
        <TotalsRow label="Total Payable" value={currency(cart?.totalPrice)} bold />
        <button
          onClick={onRecalculate}
          disabled={recalculating || !cart}
          title="Recalculate totals"
          className="text-gray-400 hover:text-[#006E74] disabled:opacity-40 transition-colors ml-3"
        >
          <RefreshCw size={14} className={recalculating ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  </div>
);

const CartPage = () => {
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const customerId = customer?.value ?? null;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchCart = async (id) => {
    if (!id) {
      setCartData(null);
      setEntries([]);
      return;
    }
    setLoading(true);
    try {
      const cartRes = await api.get(`/cart/get?identifier=${id}`);
      setCartData(cartRes.data);

      const entriesRes = await api.post("/cartEntry/list", { page: 0, sizePerPage: 500 });
      const all = Array.isArray(entriesRes.data)
        ? entriesRes.data
        : (entriesRes.data?.dtoList ?? []);
      setEntries(all.filter((e) => e.cartId === id));
    } catch (err) {
      console.error(err);
      setCartData(null);
      setEntries([]);
      showToast("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart(customerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const handleAddProduct = async () => {
    if (!selectedProduct?.value || !customerId) return;
    setSaving(true);
    try {
      await api.post("/cartEntry/add", {
        productId: selectedProduct.value,
        cartId: customerId,
        quantity: 1,
      });
      setSelectedProduct(null);
      await fetchCart(customerId);
      showToast("Item added");
    } catch {
      showToast("Failed to add item");
    } finally {
      setSaving(false);
    }
  };

  const handleQtyChange = async (index, qty) => {
    const entry = entries[index];
    const parsed = Number(qty);
    if (!parsed || parsed < 1) return;
    try {
      await api.post("/cartEntry/update", { ...entry, quantity: parsed });
      await fetchCart(customerId);
    } catch (err) {
      console.error(err);
      showToast("Failed to update quantity");
    }
  };

  const handleRemove = async (index) => {
    const entry = entries[index];
    try {
      await api.post("/cartEntry/delete", { identifier: entry.identifier });
      await fetchCart(customerId);
      showToast("Item removed");
    } catch (err) {
      console.error(err);
      showToast("Failed to remove item");
    }
  };

  const handleRecalculate = async () => {
    if (!customerId) return;
    setRecalculating(true);
    try {
      const res = await api.post(`/cart/recalculate?identifier=${customerId}`);
      setCartData(res.data);
      showToast("Totals updated");
    } catch {
      showToast("Recalculate failed");
    } finally {
      setRecalculating(false);
    }
  };

  const handleSaveCart = async () => {
    if (!customerId) return;
    setSaving(true);
    try {
      const res = await api.post(`/cart/recalculate?identifier=${customerId}`);
      setCartData(res.data);
      showToast("Cart saved");
    } catch {
      showToast("Failed to save cart");
    } finally {
      setSaving(false);
    }
  };

  const handleClearCart = async () => {
    if (!customerId) return;
    try {
      await api.post("/cart/delete", { identifier: customerId });
      setEntries([]);
      setCartData(null);
      showToast("Cart cleared");
    } catch (err) {
      console.error(err);
      showToast("Failed to clear cart");
    }
  };

  return (
    <PageGuard>
      <Layout>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-[#D9E5E7]">

              {/* Header */}
              <div className="bg-gradient-to-r from-red-700 to-red-500 px-8 py-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={24} className="text-white" />
                  <div>
                    <h2 className="text-3xl font-bold text-white">Cart</h2>
                    <p className="text-cyan-100 mt-1 text-sm">Manage customer cart and items</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">

                {/* Customer / ID / Date row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Customer">
                    <CustomerSelect value={customer} onChange={setCustomer} />
                  </Field>
                  <Field label="Customer ID">
                    <p className="font-medium text-gray-900 font-mono text-sm">
                      {customerId || "-"}
                    </p>
                  </Field>
                  <Field label="Date">
                    <p className="font-medium text-gray-500">{today()}</p>
                  </Field>
                </div>

                {/* Add product — inlined to avoid sub-component forwardRef issue */}
                {customerId && (
                  <div className="bg-white rounded-2xl p-4 border border-[#D9E5E7] shadow-sm">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Add Product</p>
                        <ProductSelect
                          value={selectedProduct}
                          onChange={setSelectedProduct}
                        />
                      </div>
                      <button
                        onClick={handleAddProduct}
                        disabled={saving || !selectedProduct}
                        title="Add Product"
                        className="h-[52px] w-11 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-700 to-red-500 text-black hover:opacity-90 disabled:opacity-40"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Cart table + totals */}
                {loading ? (
                  <div className="py-12 text-center text-gray-400 text-sm">Loading cart...</div>
                ) : (
                  <>
                    <CartTable
                      entries={entries}
                      onQtyChange={handleQtyChange}
                      onRemove={handleRemove}
                    />
                    <CartTotals
                      cart={cartData}
                      onRecalculate={handleRecalculate}
                      recalculating={recalculating}
                    />
                  </>
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={handleSaveCart}
                    disabled={!customerId || saving}
                    className="flex-1 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:scale-[1.02] hover:shadow-xl disabled:opacity-40 transition-all duration-300 shadow-lg"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      "Save Cart"
                    )}
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="flex-1 py-3 rounded-2xl font-semibold border border-red-600 text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleClearCart}
                    disabled={!customerId}
                    className="flex-1 py-3 rounded-2xl font-semibold border border-red-500 text-red-600 hover:bg-red-50 transition-all"
                  >
                    Clear Cart
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-[#D9E5E7] shadow-lg px-6 py-3 rounded-xl text-sm text-gray-700 z-50">
            {toast}
          </div>
        )}
      </Layout>
    </PageGuard>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

CartTable.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

TotalsRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  green: PropTypes.bool,
  bold: PropTypes.bool,
};

CartTotals.propTypes = {
  cart: PropTypes.shape({
    originalPrice: PropTypes.number,
    discount: PropTypes.number,
    totalPrice: PropTypes.number,
  }),
  onRecalculate: PropTypes.func.isRequired,
  recalculating: PropTypes.bool,
};

export default CartPage;