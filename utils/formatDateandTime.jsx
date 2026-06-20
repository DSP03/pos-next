export const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleString();
};