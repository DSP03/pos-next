"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

const Profile = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const username = localStorage.getItem("username");

      if (!username) {
        router.push("/");
        return;
      }

      const response = await api.get(
        `/user/get?username=${username}`
      );

      setUser(response.data);

    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F7F8]">
        <div className="text-2xl font-semibold text-[#006E74]">
          Loading Profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F7F8]">
        <div className="text-xl font-semibold text-[#FC6A59]">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F7F8] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#FFFFFF] rounded-3xl shadow-2xl overflow-hidden border border-[#D7E0E3]">

        {/* HEADER */}
        <div className="bg-[#006E74] px-8 py-10 text-white">
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-6 bg-[#0097AC] hover:bg-[#003C51] transition px-5 py-2 rounded-full font-semibold"
          >
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold">
            User Profile
          </h1>
          <p className="text-[#ECECE1] mt-2 text-lg">
            Account Details & Information
          </p>
        </div>

        {/* BODY */}
        <div className="p-8 md:p-10 space-y-8">

          {/* NAME */}
          <div className="bg-[#F2F7F8] rounded-2xl p-6 border border-[#D7E0E3]">

            <p className="text-sm font-semibold uppercase tracking-wide text-[#7A7480] mb-2">
              Full Name
            </p>

            <h2 className="text-2xl font-bold text-[#231F20]">
              {user?.name || "N/A"}
            </h2>
          </div>

          {/* EMAIL */}
          <div className="bg-[#F2F7F8] rounded-2xl p-6 border border-[#D7E0E3]">

            <p className="text-sm font-semibold uppercase tracking-wide text-[#7A7480] mb-2">
              Email / Username
            </p>

            <h2 className="text-2xl font-bold text-[#231F20]">
              {user?.username || "N/A"}
            </h2>
          </div>

          {/* PHONE */}
          <div className="bg-[#F2F7F8] rounded-2xl p-6 border border-[#D7E0E3]">

            <p className="text-sm font-semibold uppercase tracking-wide text-[#7A7480] mb-2">
              Phone Number
            </p>

            <h2 className="text-2xl font-bold text-[#231F20]">
              {user?.phoneNo || "N/A"}
            </h2>
          </div>

          {/* ROLES */}
          <div className="bg-[#F2F7F8] rounded-2xl p-6 border border-[#D7E0E3]">

            <p className="text-sm font-semibold uppercase tracking-wide text-[#7A7480] mb-4">
              Roles
            </p>

            <div className="flex flex-wrap gap-3">

              {Array.isArray(user?.roles) ? (
                user.roles.map((role) => (
                  <span
                    key={role.name || role}
                    className="bg-[#01B27C] text-white px-4 py-2 rounded-full font-semibold"
                  >
                    {role.name || role}
                  </span>
                ))
              ) : (
                <span className="bg-[#881E87] text-white px-4 py-2 rounded-full font-semibold">
                  {user?.roles || "No Roles"}
                </span>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;