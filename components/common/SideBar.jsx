"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const Sidebar = ({ nodes, collapsed, onToggle }) => {
  const router = useRouter();

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-[64px]" : "w-[240px]"
      }`}
    >
      {/* Logo / Title */}
      <div className="flex items-center justify-between px-3 py-5 border-b border-white/10">
        {!collapsed && (
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-white text-xl font-bold truncate hover:text-[#0097AC] transition"
          >
            Dashboard
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`text-gray-400 hover:text-white hover:bg-white/10 rounded p-1.5 transition ${
            collapsed ? "mx-auto" : "ml-auto"
          }`}
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">

        {/* Dynamic nodes */}
        {Array.isArray(nodes) &&
          nodes.map((node) => (
            <button
              key={node.identifier}
              type="button"
              onClick={() => router.push(node.path)}
              title={node.identifier}
              className="flex items-center gap-3 text-gray-200 hover:bg-white/10 p-3 rounded w-full text-left transition"
            >
              {/* Generic icon placeholder — swap with node icon if available */}
              <span className="w-5 h-5 shrink-0 flex items-center justify-center rounded bg-white/10 text-xs font-bold uppercase">
                {node.identifier?.charAt(0)}
              </span>
              {!collapsed && <span className="truncate">{node.identifier}</span>}
            </button>
          ))}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      identifier: PropTypes.string,
      path: PropTypes.string,
    })
  ),
  collapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

Sidebar.defaultProps = {
  nodes: [],
};

export default Sidebar;