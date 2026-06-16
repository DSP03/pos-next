"use client";

import PropTypes from "prop-types";
import AsyncSelect from "react-select/async";
import api from "@/services/api";

const CustomerSelect = ({ value, onChange }) => {
  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];

    const res = await api.get(
      `/customer/search?query=${inputValue}`
    );

    const data = res.data ?? [];

    return data.map((c) => ({
      value: c.identifier,
      label: `${c.name} - ${c.phoneNo}`,
    }));
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={value}
      onChange={onChange}
      placeholder="Search customer..."
      isClearable
    />
  );
};

CustomerSelect.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default CustomerSelect;