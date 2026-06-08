"use client";

import { useRouter } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ nodes }) => {

  const router = useRouter();

  return (

    <div className="fixed top-0 left-0 w-[240px] h-screen bg-gray-900 flex flex-col">

      <h1
        onClick={() => router.push("/dashboard")}
        className="text-white text-2xl font-bold text-center py-6 cursor-pointer"
      >
        Dashboard
      </h1>

      <div className="flex-1 overflow-y-auto px-3">

        <div
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 text-gray-200 hover:bg-white/10 p-3 rounded cursor-pointer mb-2"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </div>

        {Array.isArray(nodes) &&
          nodes.map((node) => (
            <div
              key={node.identifier}
              onClick={() => router.push(node.path)}
              className="text-gray-200 hover:bg-white/10 p-3 rounded cursor-pointer mb-2"
            >
              {node.identifier}
            </div>
          ))}

      </div>

    </div>
  );
};

export default Sidebar;