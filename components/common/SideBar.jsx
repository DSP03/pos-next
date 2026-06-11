"use client";

import { useRouter } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/outline";
import PropTypes from 'prop-types';

const Sidebar = ({ nodes }) => {

  const router = useRouter();

  return (

    <div className="fixed top-0 left-0 w-[240px] h-screen bg-gray-900 flex flex-col">

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="text-white text-2xl font-bold text-center py-6 cursor-pointer w-full"
      >
        Dashboard
      </button>

      <div className="flex-1 overflow-y-auto px-3">

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 text-gray-200 hover:bg-white/10 p-3 rounded cursor-pointer mb-2 w-full text-left"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </button>

        {Array.isArray(nodes) &&
          nodes.map((node) => (
            <button
              key={node.identifier}
              onClick={() => router.push(node.path)}
              className="text-gray-200 hover:bg-white/10 p-3 rounded cursor-pointer mb-2 w-full text-left"
              type="button"
            >
              {node.identifier}
            </button>
          ))}

      </div>

    </div>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      identifier: PropTypes.string,
      path: PropTypes.string,
    })
  ),
};

Sidebar.defaultProps = {
  nodes: [],
};