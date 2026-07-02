import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

/* PUBLIC ENDPOINTS */
const publicUrls = [
  "/authenticate",
  "/user/add",
  "/role/list",
  "/validateToken",
];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const url = config.url || "";

    const isPublic = publicUrls.some(
      (path) => url === path || url.startsWith(path)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const skipAuthRedirect = error.config?.skipAuthRedirect;

    // Unauthenticated — no/invalid/expired token. Always redirect, token or not.
    if (status === 401) {
      localStorage.clear();
      sessionStorage.setItem(
        "errorMessage",
        error.response?.data?.message || "Session expired. Please log in again."
      );
      globalThis.location.href = "/login";
      return Promise.reject(error);
    }

    // Authenticated but not allowed for this action/route
    if (status === 403 && !skipAuthRedirect) {
      sessionStorage.setItem(
        "errorMessage",
        error.response?.data?.message || "Access Denied"
      );
      globalThis.location.href = "/unauthorized";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;