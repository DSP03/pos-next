"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PageGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Not logged in
    if (!token) {
      router.replace("/login");
      return;
    }

    const nodes = JSON.parse(
      localStorage.getItem("allowedNodes") || "[]"
    );

    console.log("Current Path:", pathname);
    console.log("Allowed Nodes:", nodes);

    const allowed = nodes.some((node) => {
      const nodePath = node.path || "";

      const basePath = nodePath.replace("/list", "");

      return (
        pathname === nodePath ||
        pathname === basePath ||
        pathname.startsWith(basePath + "/")
      );
    });

    console.log("Allowed:", allowed);

    if (!allowed) {
      router.replace("/unauthorized");
      return;
    }

    setAuthorized(true);
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F7F8]">
        <div className="h-12 w-12 rounded-full border-4 border-[#0097AC] border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}