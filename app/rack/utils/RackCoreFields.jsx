export const RACK_INITIAL_FORM = {
  identifier: "",
  name: "",
  shelfIdentifiers: [],
  status: true,
};

export const validateRack = (form) => {
  const errors = {};

  if (!form.name?.trim()) {
    errors.name = "Rack name is required";
  } else if (/\s/.test(form.name)) {
    errors.name = "Spaces are not allowed in rack name";
  }

  return errors;
};

export const getRackFields = (shelfOptions = []) => [
  {
    name: "name",
    label: "Rack Name",
    type: "text",
  },
  {
    name: "shelfIdentifiers",
    label: "Shelves",
    type: "multicheck",
    options: shelfOptions,
  },
  {
    name: "status",
    label: "Status",
    type: "status",
  },
];