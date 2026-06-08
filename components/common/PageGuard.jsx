"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PageGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

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
      router.replace("/dashboard");
    }
  }, [pathname, router]);

  return <>{children}</>;
}