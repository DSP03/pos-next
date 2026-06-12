"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/services/api";
import EditPage from "@/components/common/EditPage";

const UserEdit = () => {
  const params = useParams();
  const router = useRouter();

  const username = decodeURIComponent(params.username);

  const [userData, setUserData] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (username) {
      loadUser();
      loadRoles();
    }
  }, [username]);

  const loadUser = async () => {
    try {
      const res = await api.get("/user/get", {
        params: { username },
      });
      setUserData(res.data);
    } catch (err) {
      console.log("GET ERROR:", err);
    }
  };

  const loadRoles = async () => {
    try {
      const res = await api.post("/role/list", {
        page: 0,
        sizePerPage: 100,
      });
      setRoles(
        (res.data.dtoList || []).map((r) => ({
          identifier: r.identifier,
          label: r.name || r.identifier,
        }))
      );
    } catch (err) {
      console.log("ROLE ERROR:", err);
    }
  };

  if (!userData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <EditPage
      title="Edit User"
      modelName="user"
      options={{ roles }}
      fields={[
        { name: "id",       label: "ID",       type: "text",       disabled: true },
        { name: "name",     label: "Name",     type: "text" },
        { name: "username", label: "Username", type: "text" },
        { name: "phoneNo",  label: "Phone",    type: "text" },
        { name: "roles",    label: "Roles",    type: "multicheck" },
      ]}
      initialForm={{
        id:       userData.id       || "",
        name:     userData.name     || "",
        username: userData.username || "",
        phoneNo:  userData.phoneNo  || "",
        roles:    Array.isArray(userData.roles) ? userData.roles : [],
      }}
      validate={(form) => {
        const nameRegex  = /^[A-Za-z\s]+$/;
        const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
        const phoneRegex = /^\d{10}$/;

        if (form.name.trim().length < 3) {
          return "Name must be at least 3 characters";
        }

        if (!nameRegex.test(form.name)) {
          return "Name must contain only letters";
        }

        if (!emailRegex.test(form.username)) {
          return "Invalid email address";
        }

        if (!phoneRegex.test(form.phoneNo || "")) {
          return "Invalid phone number";
        }

        if (!form.roles?.length) {
          return "Select at least one role";
        }

        return null;
      }}
      onSuccess={() => router.push("/user/list")}
      onCancel={() => router.push("/user/list")}
    />
  );
};

export default UserEdit;