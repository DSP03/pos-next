export const WAREHOUSE_CORE_FIELDS = [
  {
    name: "identifier",
    label: "Warehouse Code",
    type: "text",
  },
  {
    name: "warehouseName",
    label: "Warehouse Name",
    type: "text",
  },
  {
    name: "country",
    label: "Country",
    type: "text",
  },
  {
    name: "state",
    label: "State",
    type: "text",
  },
  {
    name: "cityName",
    label: "City",
    type: "text",
  },
  {
    name: "location",
    label: "Location",
    type: "textarea",
  },
];

export const WAREHOUSE_INITIAL_FORM = {
  identifier: "",
  warehouseName: "",
  country: "",
  state: "",
  cityName: "",
  location: "",
};

export const validateWarehouse = (form) => {
  const errors = {};

  if (!form.identifier?.trim()) {
    errors.identifier = "Warehouse code is required";
  } else if (/\s/.test(form.identifier)) {
    errors.identifier = "Spaces are not allowed in warehouse code";
  }

  if (!form.warehouseName?.trim()) {
    errors.warehouseName = "Warehouse name is required";
  }

  if (!form.country?.trim()) {
    errors.country = "Country is required";
  }

  if (!form.state?.trim()) {
    errors.state = "State is required";
  }

  if (!form.cityName?.trim()) {
    errors.cityName = "City is required";
  }

  if (!form.location?.trim()) {
    errors.location = "Location is required";
  }

  return errors;
};