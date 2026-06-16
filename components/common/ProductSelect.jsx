"use client";

import AsyncSelect from "react-select/async";
import api from "@/services/api";
import PropTypes from "prop-types";

const ProductSelect = ({ value, onChange }) => {
  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const res = await api.get(
        `/product/search?query=${encodeURIComponent(inputValue)}`
      );

      const data = res.data ?? [];

      return data.map((p) => ({
        value: p.identifier,
        label: p.productName || p.name || p.identifier,
      }));
    } catch (error) {
      console.error("Failed to load products:", error);
      return [];
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={value}
      onChange={onChange}
      placeholder="Search product..."
      isClearable
      styles={{
        control: (provided) => ({
          ...provided,
          minHeight: "42px",
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
        }),
        option: (provided, state) => ({
          ...provided,
          color: "#000000",
          backgroundColor: state.isFocused ? "#F3F4F6" : "#FFFFFF",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "#000000",
        }),
        input: (provided) => ({
          ...provided,
          color: "#000000",
        }),
        placeholder: (provided) => ({
          ...provided,
          color: "#6B7280",
        }),
        menuList: (provided) => ({
          ...provided,
          color: "#000000",
        }),
      }}
    />
  );
};

ProductSelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};

ProductSelect.defaultProps = {
  value: null,
  onChange: () => {},
};

export default ProductSelect;