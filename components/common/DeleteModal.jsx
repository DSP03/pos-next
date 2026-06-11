"use client";

import PropTypes from "prop-types";

const DeleteModal = ({ onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      backgroundColor: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "2rem",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#FEE2E2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#111827" }}>
          Delete item?
        </h2>
      </div>

      <p style={{ margin: "0 0 1.5rem", fontSize: "14px", color: "#6B7280", lineHeight: "1.6" }}>
        This action cannot be undone. Are you sure you want to permanently delete this item?
      </p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            border: "1px solid #D1D5DB",
            background: "white",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#EF4444",
            color: "white",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

DeleteModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteModal;