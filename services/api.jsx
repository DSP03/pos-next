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

    const isPublic = publicUrls.some((path) =>
      url === path || url.startsWith(path)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => {
    console.log("SUCCESS:", response.status, response.config.url);
    return response;
  },
  (error) => {
 
    console.log("ERROR RESPONSE:", error.response);
 
    const status = error.response?.status;
    const token = localStorage.getItem("token");
 
    console.log("Status:", status);
    console.log("Token:", token);
 
    if (token && (status === 401 || status === 403)) {
 
      console.log("Redirecting to login...");
 
      localStorage.clear();
      globalThis.location.href = "/login";
    }
 
    return Promise.reject(error);
  }
);

export default api;