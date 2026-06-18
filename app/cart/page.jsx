"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ShoppingCart, User, UserPlus } from "lucide-react";
import api from "@/services/api";
import PropTypes from "prop-types";
import Layout from "@/components/common/Layout";
import CustomerSelect from "@/components/common/CustomerSelect";
import ProductSelect from "@/components/common/ProductSelect";
import PageGuard from "@/components/common/PageGuard";
import AddModal from "@/components/common/AddModal";
import FormRenderer from "@/components/common/FormRenderer";
import { validateCustomer } from "@/app/customer/utils/customerValidator";

const today = () =>
  new Date().toLocaleDateString("en-GB").replaceAll("/", "-");

const currency = (val) =>
  `₹${Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

// Quick-add customer form — mirrors the simplified fields used on the
// customer list popup (no billing/shipping address here either).
const CUSTOMER_FIELDS = [
  { name: "divider-core", type: "divider", label: "Customer Information" },
  { name: "name", type: "text", label: "Full Name", required: true },
  { name: "phoneNo", type: "phone", label: "Phone Number", required: true },
  { name: "email", type: "email", label: "Email Address" },
  {
    name: "partyType",
    type: "select",
    label: "Party Type",
    options: [
      { identifier: "individual", label: "Individual" },
      { identifier: "business", label: "Business" },
      { identifier: "government", label: "Government" },
    ],
  },
  {
    name: "balanceType",
    type: "radio",
    label: "Balance Type",
    options: [
      { identifier: "credit", label: "Credit" },
      { identifier: "debit", label: "Debit" },
    ],
  },
  { name: "balance", type: "number", label: "Opening Balance" },
  { name: "creditLimit", type: "number", label: "Credit Limit" },
  { name: "status", type: "status", label: "Status" },
];

const CUSTOMER_INITIAL_FORM = {
  name: "",
  phoneNo: "",
  email: "",
  balance: 0,
  balanceType: "",
  partyType: "",
  creditLimit: 0,
  status: true,
};

const Field = ({ label, children }) => (
  <div className="border border-[#D9E5E7] rounded-lg px-4 pt-2 pb-2.5">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    {children}
  </div>
);

// Isolated row so each qty input has its own draft state
const CartRow = ({ entry, index, onQtyChange, onRemove }) => {
  const [draft, setDraft] = useState(String(entry.quantity));

  // Keep draft in sync if parent refreshes entries (e.g. after API call)
  useEffect(() => {
    setDraft(String(entry.quantity));
  }, [entry.quantity]);

  const commit = (val) => {
    const parsed = Number(val);
    if (parsed >= 1) {
      onQtyChange(index, parsed);
    } else {
      // Reset to last known good value
      setDraft(String(entry.quantity));
    }
  };

  return (
    <tr className="border-b border-[#D9E5E7] hover:bg-red-50">
      <td className="px-4 py-3 font-medium text-gray-900">{entry.productId}</td>
      <td className="px-4 py-3 text-gray-500 text-sm">{entry.productName}</td>
      <td className="px-4 py-3 text-gray-400 line-through">{currency(entry.mrp)}</td>
      <td className="px-4 py-3 text-gray-700">{currency(entry.sellingPrice)}</td>
      <td className="px-4 py-3 text-green-600 font-medium">{currency(entry.discount)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onQtyChange(index, entry.quantity - 1)}
            className="w-6 h-6 rounded-full border border-[#D9E5E7] flex items-center justify-center text-gray-500 hover:bg-red-50 hover:border-red-300 text-xs"
          >−</button>
          <input
            type="number"
            min={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}           // free typing, no validation yet
            onBlur={() => commit(draft)}                          // validate + save on blur
            onKeyDown={(e) => { if (e.key === "Enter") { e.target.blur(); } }} // Enter commits too
            className="w-12 text-center font-medium border border-[#D9E5E7] rounded-lg py-0.5 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
          />
          <button
            onClick={() => onQtyChange(index, entry.quantity + 1)}
            className="w-6 h-6 rounded-full border border-[#D9E5E7] flex items-center justify-center text-gray-500 hover:bg-red-50 hover:border-red-300 text-xs"
          >+</button>
        </div>
      </td>
      <td className="px-4 py-3 font-semibold text-gray-900">{currency(entry.totalPrice)}</td>
      <td className="px-4 py-3">
        <button onClick={() => onRemove(index)} title="Remove item" className="text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};

const CartTable = ({ entries, onQtyChange, onRemove }) => (
  <div className="overflow-x-auto rounded-2xl border border-[#D9E5E7] mt-4">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-[#D9E5E7] bg-[#F2F7F8]">
          {["Product","Product Name", "MRP", "Selling Price", "Discount", "Qty", "Subtotal", ""].map((h) => (
            <th key={h} className="px-4 py-3 text-left font-semibold text-red-700">{h}</th>
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
            <CartRow key={entry.identifier ?? i} entry={entry} index={i} onQtyChange={onQtyChange} onRemove={onRemove} />
          ))
        )}
      </tbody>
    </table>
  </div>
);

const CartPage = () => {
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  // --- Quick add-customer modal state ---
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState(CUSTOMER_INITIAL_FORM);
  const [customerErrors, setCustomerErrors] = useState({});
  const [customerSaving, setCustomerSaving] = useState(false);

  const customerId = customer?.value ?? null;
  const customerName = customer?.label ?? null;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchCart = async (id) => {
    if (!id) { setCartData(null); setEntries([]); return; }
    setLoading(true);
    try {
      const cartRes = await api.get(`/cart/get?identifier=${id}`);
      setCartData(cartRes.data);
      const entriesRes = await api.post("/cartEntry/list", { page: 0, sizePerPage: 500 });
      const all = Array.isArray(entriesRes.data) ? entriesRes.data : (entriesRes.data?.dtoList ?? []);
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

  useEffect(() => { fetchCart(customerId); }, [customerId]);

  const handleAddProduct = async () => {
    if (!selectedProduct?.value || !customerId) return;
    setSaving(true);
    try {
      await api.post("/cartEntry/add", { productId: selectedProduct.value, cartId: customerId, quantity: 1 });
      setSelectedProduct(null);
      await fetchCart(customerId);
      showToast("Item added");
    } catch { showToast("Failed to add item"); } finally { setSaving(false); }
  };

  const handleQtyChange = async (index, qty) => {
    const entry = entries[index];
    const parsed = Number(qty);
    // validation is handled by CartRow's commit() before this is called
    try {
      await api.post("/cartEntry/update", { ...entry, quantity: parsed });
      await fetchCart(customerId);
    } catch { showToast("Failed to update quantity"); }
  };

  const handleRemove = async (index) => {
    const entry = entries[index];
    try {
      await api.post("/cartEntry/delete", { identifier: entry.identifier });
      await fetchCart(customerId);
      showToast("Item removed");
    } catch { showToast("Failed to remove item"); }
  };

  const handleSaveCart = async () => {
    if (!customerId) return;
    setSaving(true);
    try {
      const res = await api.post(`/cart/recalculate?identifier=${customerId}`);
      setCartData(res.data);
      showToast("Cart saved");
    } catch { showToast("Failed to save cart"); } finally { setSaving(false); }
  };

  const handleClearCart = async () => {
    if (!customerId) return;
    try {
      await api.post("/cart/delete", { identifier: customerId });
      setEntries([]);
      setCartData(null);
      showToast("Cart cleared");
    } catch { showToast("Failed to clear cart"); }
  };

  // --- Quick add-customer handlers ---
  const openAddCustomer = () => {
    setCustomerForm(CUSTOMER_INITIAL_FORM);
    setCustomerErrors({});
    setShowAddCustomer(true);
  };

  const closeAddCustomer = () => {
    setShowAddCustomer(false);
    setCustomerErrors({});
  };

  const handleAddCustomerSubmit = async () => {
    const err = validateCustomer(customerForm);
    if (Object.keys(err).length) {
      setCustomerErrors(err);
      return;
    }

    try {
      setCustomerSaving(true);
      setCustomerErrors({});

      const res = await api.post("/customer/add", customerForm);

      if (res.data && res.data.success === false) {
        setCustomerErrors({ api: res.data.message || "Failed to save customer." });
        return;
      }

      // NOTE: assumes the created customer record (with its identifier) comes
      // back as res.data, or res.data.data — adjust this line if your
      // /customer/add response shape is different.
      const created = res.data?.data ?? res.data ?? {};

      setCustomer({
        value: created.identifier ?? created.id,
        label: created.name ?? customerForm.name,
      });

      setShowAddCustomer(false);
      showToast("Customer added");
    } catch (err) {
      console.error(err);
      setCustomerErrors({ api: "Server error. Please try again." });
    } finally {
      setCustomerSaving(false);
    }
  };

  const initials = customerName
    ? customerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : null;

  return (
    <PageGuard>
      <Layout>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 to-red-500 px-8 py-5 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={22} className="text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Cart</h2>
                    <p className="text-red-100 text-xs mt-0.5">Manage customer cart and items</p>
                  </div>
                </div>

                <button
                  onClick={openAddCustomer}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  <UserPlus size={16} />
                  Add Customer
                </button>
              </div>
            </div>

            {/* 70 / 30 grid — both columns same height */}
            <div className="grid grid-cols-[1fr_auto] gap-0 items-stretch">

              {/* ── LEFT 70% ── */}
              <div className="bg-white border-l border-b border-[#D9E5E7] rounded-bl-3xl p-6 space-y-5 min-w-0">

                {/* Customer / ID / Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Customer">
                    <CustomerSelect value={customer} onChange={setCustomer} />
                  </Field>
                  <Field label="Customer ID">
                    <p className="font-medium text-gray-900 font-mono text-sm">{customerId || "—"}</p>
                  </Field>
                  <Field label="Date">
                    <p className="font-medium text-gray-500">{today()}</p>
                  </Field>
                </div>

                {/* Add product */}
                {customerId && (
                  <div className="bg-white rounded-2xl p-4 border border-[#D9E5E7] shadow-sm">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Add Product</p>
                        <ProductSelect value={selectedProduct} onChange={setSelectedProduct} />
                      </div>
                      <button
                        onClick={handleAddProduct}
                        disabled={saving || !selectedProduct}
                        title="Add Product"
                        className="h-[52px] w-11 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-700 to-red-500 text-white hover:opacity-90 disabled:opacity-40"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Cart table */}
                <div>
                  {loading ? (
                    <div className="py-12 text-center text-gray-400 text-sm">Loading cart...</div>
                  ) : (
                    <CartTable entries={entries} onQtyChange={handleQtyChange} onRemove={handleRemove} />
                  )}
                </div>

              </div>

              {/* ── RIGHT 30% ── */}
              <div
                className="bg-white border border-[#D9E5E7] border-l-0 rounded-br-3xl p-6 flex flex-col gap-4"
                style={{ width: "320px" }}
              >

                {/* Order summary */}
                <div>
                  <p className="font-semibold text-gray-800 text-base">Order summary</p>
                  <p className="text-xs text-gray-400 mb-3">{entries.length} item{entries.length === 1 ? "" : "s"} in cart</p>

                  <div className="space-y-2 text-sm">
                    {entries.map((e) => (
                      <div key={e.productId} className="flex justify-between text-gray-700">
                        <span>{e.productName} × {e.quantity}</span>
                        <span>{currency(e.totalPrice)}</span>
                      </div>
                    ))}
                    {entries.length === 0 && (
                      <p className="text-gray-400 text-xs">No items yet.</p>
                    )}
                  </div>

                  <div className="border-t border-[#D9E5E7] mt-3 pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Original price</span>
                      <span>{currency(cartData?.originalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>− {currency(cartData?.discount)}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total payable</span>
                    <span className="text-xl font-bold text-gray-900">{currency(cartData?.totalPrice)}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#D9E5E7]" />

                {/* Bill To */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Bill To</p>
                  {customerId ? (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {initials ?? <User size={16} />}
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{customerName || "—"}</p>
                        <p className="text-gray-400 text-xs mt-0.5">Customer</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Select a customer to bill.</p>
                  )}

                  <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cart ID</span>
                      <span className="font-mono text-gray-700">{customerId || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="text-gray-700">{today()}</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#D9E5E7]" />

                {/* Action buttons — pushed to bottom */}
                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={handleSaveCart}
                    disabled={!customerId || saving}
                    className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:opacity-90 disabled:opacity-40 transition-all shadow-md text-sm"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : "Checkout"}
                  </button>
                  <button
                    onClick={handleClearCart}
                    disabled={!customerId}
                    className="w-full py-3 rounded-2xl font-semibold border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-40 transition-all text-sm"
                  >
                    Clear cart
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="w-full py-3 rounded-2xl font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all text-sm"
                  >
                    Back
                  </button>
                </div>

              </div>
            </div>
            {/* end grid */}

          </div>
        </div>

        {/* Quick add-customer popup */}
        <AddModal
          open={showAddCustomer}
          title="Add Customer"
          loading={customerSaving}
          onClose={closeAddCustomer}
          onSubmit={handleAddCustomerSubmit}
        >
          <FormRenderer
            fields={CUSTOMER_FIELDS}
            form={customerForm}
            setForm={setCustomerForm}
            errors={customerErrors}
            columns={2}
          />

          {customerErrors.api && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {customerErrors.api}
            </div>
          )}
        </AddModal>

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

Field.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node };
CartRow.propTypes = {
  entry: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
CartTable.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartPage;