import api from "@/services/api";

/* GENERIC */
const fetchList = async (url) => {
  const res = await api.post(url, {
    page: 0,
    sizePerPage: 100,
  });

  return res.data.dtoList || [];
};

/* BRAND */
export const getBrands = async () => {
  return await fetchList("/brand/list");
};

/* MODEL */
export const getModels = async () => {
  return await fetchList("/models/list");
};

/* UNIT */
export const getUnits = async () => {
    const res = await api.post("/unit/active");
    return res.data || [];
};

/* CATEGORY */
export const getCategories = async () => {
  return await fetchList("/category/list");
};

/* ROLES */
export const getRoles = async () => {
  return await fetchList("/role/list");
};

/* PRICE TYPES */
export const getPriceTypes = async () => {
  const res = await api.post("/price/priceTypes");
  return (res.data || []).map((type) => ({identifier: type, label: type}));
};

/* SHELVES */
export const getActiveShelves = async () => {
  const res = await api.get("/shelf/active");
  return res.data || [];
};