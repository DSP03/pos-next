"use client";

import PropTypes from "prop-types";

const ActionButtons = ({
  onEdit,
  onDelete,
  onToggle,
  isActive,
}) => {
  return (
    <div className="flex gap-2 justify-center">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Edit
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Delete
        </button>
      )}

      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className={`px-3 py-1 text-xs rounded-md text-white transition ${
            isActive
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isActive ? "Disable" : "Enable"}
        </button>
      )}
    </div>
  );
};

ActionButtons.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onToggle: PropTypes.func,
  isActive: PropTypes.bool,
};

export default ActionButtons;