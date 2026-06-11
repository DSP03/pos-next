"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/services/api";

import Sidebar from "@/components/common/SideBar";
import Navbar from "@/components/common/NavBar";

const DashboardLayout = ({ children }) => {
  const router = useRouter();

  const [nodes, setNodes] = useState([]);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const fetchNodes = async () => {
    try {
      const res = await api.get("/home");

      const allowedNodes = res.data || [];

      setNodes(allowedNodes);

      localStorage.setItem(
        "allowedNodes",
        JSON.stringify(allowedNodes)
      );

      console.log("Allowed Nodes:", allowedNodes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNodes();

    const logoutDeletedUser = () => {
      if (accountDeleted) return;

      setAccountDeleted(true);

      setTimeout(() => {
        localStorage.clear();
        router.push("/login");
      }, 2000);
    };

    const validateUserToken = async () => {
      if (accountDeleted) return;

      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!token || !username) {
        localStorage.clear();
        router.push("/login");
        return;
      }

      try {
        const res = await api.post("/validateToken", {
          token,
          username,
        });

        if (res.data !== true) {
          logoutDeletedUser();
        }
      } catch (err) {
        console.error("Token validation error:", err);
        logoutDeletedUser();
      }
    };

    validateUserToken();

    const interval = setInterval(
      validateUserToken,
      5000
    );

    return () => clearInterval(interval);
  }, [router, accountDeleted]);

  return (
    <div className="min-h-screen bg-[#E9EEF5]">
      {accountDeleted && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-xl bg-white p-6 text-center shadow-xl">
            <h2 className="mb-3 text-xl font-bold text-red-600">
              Account Deleted or Updated by Admin or yourself
            </h2>

            <p className="text-gray-700">
              Your account has been deleted or updated by an administrator or yourself.
            </p>

            <p className="mt-2 text-gray-700">
              Redirecting to login...
            </p>
          </div>
        </div>
      )}

      <Sidebar nodes={nodes} />
      <Navbar />

      <div className="ml-[240px] pt-20 p-8">
        {children}
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;