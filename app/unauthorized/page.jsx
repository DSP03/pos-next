"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F7F8] p-6">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full text-center">
        <div className="text-red-600 text-6xl mb-4">
          🚫
        </div>

        <h1 className="text-3xl font-bold text-[#003C51] mb-3">
          Access Denied
        </h1>

        <p className="text-gray-600 mb-8">
          You are not authorized to access this page.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-[#0097AC] hover:bg-[#006E74] text-white py-3 rounded-xl font-semibold"
          >
            Go To Dashboard
          </button>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
          >
            Logout & Login Again
          </button>
        </div>
      </div>
    </div>
  );
}