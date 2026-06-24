"use client";

import PropTypes from "prop-types";

const ActionModal = ({
  open,
  title,
  children,
  loading = false,
  onClose,
  onSubmit,
  submitLabel = "Confirm",
  savingLabel = "Processing...",
  cancelLabel = "Cancel",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#003C51] to-[#006E74] px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="text-white text-2xl leading-none hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:opacity-90 text-white font-semibold disabled:opacity-50"
          >
            {loading ? savingLabel : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

ActionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  savingLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
};

export default ActionModal;