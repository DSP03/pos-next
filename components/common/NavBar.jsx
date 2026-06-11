"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {

  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {const user = localStorage.getItem("username");
    if (user) {
      setUsername(user);
    }

  }, []);

  const firstLetter =username?.charAt(0)?.toUpperCase() || "U";
  const logout = () => {localStorage.clear();router.push("/login");};

  return (

    <div className="fixed top-0 left-[240px] right-0 h-16 bg-[#FFFFFF] shadow-md border-b border-[#D7E0E3] flex items-center justify-between px-6 z-40">
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="font-bold text-xl text-[#006E74] cursor-pointer hover:text-[#0097AC] transition"
      >
        POS Dashboard
      </button>

      <div className="flex items-center gap-4">

        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 bg-[#F2F7F8] hover:bg-[#D7E0E3] px-4 py-2 rounded-full transition"
        >

          <div className="w-10 h-10 rounded-full bg-[#006E74] text-white flex items-center justify-center font-bold text-sm">
            {firstLetter}
          </div>

          <div className="text-left">
            <p className="text-xs text-[#7A7480]">
              Hi,
            </p>

            <p className="text-sm font-semibold text-[#231F20]">
              {username || "User"}
            </p>
          </div>

        </button>

        <button
          onClick={logout}
          className="bg-[#FC6A59] hover:bg-[#003C51] text-white px-5 py-2 rounded-full font-semibold transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default Navbar;