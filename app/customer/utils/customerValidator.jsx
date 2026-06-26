const REQUIRED_ADDRESS_FIELDS = ["addressLine", "city", "state", "zip", "country"];

const validateAddress = (address, errorKey, label) => {
  address = address || {};
  const missing = REQUIRED_ADDRESS_FIELDS.some((field) => !address[field]?.trim());
  return missing ? { [errorKey]: `All ${label} fields are mandatory` } : {};
};

export const validateCustomer = (form) => {
  const errors = {};

  if (!form.name?.trim()) {
    errors.name = "Full name is required";
  }

  if (!form.phoneNo?.trim()) {
    errors.phoneNo = "Phone number is required";
  } else if (!/^\d{10}$/.test(form.phoneNo.trim())) {
    errors.phoneNo = "Phone number must be exactly 10 digits";
  }

  if (form.email &&!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!form.partyType) {
    errors.partyType = "Party type is required";
  }

  if (!form.balanceType) {
    errors.balanceType = "Balance type is required";
  }

  if (form.balance === "" || form.balance === null || form.balance === undefined) {
    errors.balance = "Opening balance is required";
  } else if (Number.isNaN(Number(form.balance)) || Number(form.balance) < 0) {
    errors.balance = "Opening balance must be a non-negative number";
  }

  if (form.creditLimit === "" || form.creditLimit === null || form.creditLimit === undefined) {
    errors.creditLimit = "Credit limit is required";
  } else if (Number.isNaN(Number(form.creditLimit)) || Number(form.creditLimit) < 0) {
    errors.creditLimit = "Credit limit must be a non-negative number";
  }

  if (form.status === null || form.status === undefined) {
    errors.status = "Status is required";
  }

  return errors;
};

export const validateCustomerAddresses = (form) => {
  const billingErrors = validateAddress(form.billingAddress, "billingAddress", "billing address");
  const shippingErrors = validateAddress(form.shippingAddress, "shippingAddress", "shipping address");
  return { ...billingErrors, ...shippingErrors };
};

export const validateCustomerWithAddress = (form) => ({
  ...validateCustomer(form),
  ...validateCustomerAddresses(form),
});