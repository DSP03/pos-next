"use client";

import PropTypes from "prop-types";

const inputClass = (disabled) =>
  `border p-3 w-full rounded-lg outline-none transition ${
    disabled
      ? "bg-gray-100 cursor-not-allowed text-gray-500"
      : "focus:ring-2 focus:ring-blue-400"
  }`;

const FieldLabel = ({ label }) => (
  <label className="block mb-1 text-sm font-medium text-gray-700">
    {label}
  </label>
);

FieldLabel.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const FieldError = ({ error }) =>
  error ? <p className="text-red-500 text-sm mt-1">{error}</p> : null;

FieldError.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
  const TextField = ({ f, form, handleChange, errors }) => (
    <div>
      <FieldLabel label={f.label} />
      <input
        type={f.type === "phone" ? "text" : f.type}
        name={f.name}
        value={form[f.name] ?? ""}
        onChange={handleChange}
        placeholder={f.label}
        disabled={f.disabled}
        autoComplete={f.type === "password" ? "new-password" : undefined}
        inputMode={f.inputMode ?? (f.type === "phone" ? "numeric" : undefined)}
        pattern={f.type === "phone" ? String.raw`\d*` : undefined}
        maxLength={f.type === "phone" ? 10 : undefined}
        className={inputClass(f.disabled)}
      />
      <FieldError error={errors[f.name]} />
    </div>
  );

TextField.propTypes = {
  f: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

const TextareaField = ({ f, form, handleChange, errors }) => (
  <div>
    <FieldLabel label={f.label} />
    <textarea
      name={f.name}
      value={form[f.name] ?? ""}
      onChange={handleChange}
      placeholder={f.label}
      rows={4}
      disabled={f.disabled}
      className={inputClass(f.disabled)}
    />
    <FieldError error={errors[f.name]} />
  </div>
);

TextareaField.propTypes = {
  f: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

const SelectField = ({ f, form, handleChange, options, errors }) => (
  <div>
    <FieldLabel label={f.label} />
    <select
      name={f.name}
      value={form[f.name] ?? ""}
      onChange={handleChange}
      className="border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Select {f.label}</option>
      {(options[f.name] || []).map((o) => (
        <option key={o.identifier} value={o.identifier}>
          {o.label}
        </option>
      ))}
    </select>
    <FieldError error={errors[f.name]} />
  </div>
);

SelectField.propTypes = {
  f: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  errors: PropTypes.object,
};

const StatusField = ({ f, form, setForm, errors }) => (
  <div>
    <FieldLabel label={f.label} />
    <select
      name={f.name}
      value={String(form[f.name])}
      onChange={(e) =>
        setForm((prev) => ({ ...prev, [f.name]: e.target.value === "true" }))
      }
      className="border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-400"
    >
      <option value="true">Active</option>
      <option value="false">Inactive</option>
    </select>
    <FieldError error={errors[f.name]} />
  </div>
);

StatusField.propTypes = {
  f: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

const MulticheckField = ({ f, form, toggle, options, errors }) => (
  <div>
    <FieldLabel label={f.label} />
    <div className="border rounded-lg p-3 max-h-32 overflow-y-auto bg-gray-50">
      {(options[f.name] || []).map((o) => (
        <label key={o.identifier} className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            checked={form[f.name]?.includes(o.identifier)}
            onChange={() => toggle(f.name, o.identifier)}
          />
          <span className="text-sm">{o.label}</span>
        </label>
      ))}
    </div>
    <FieldError error={errors[f.name]} />
  </div>
);

MulticheckField.propTypes = {
  f: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  options: PropTypes.object,
  errors: PropTypes.object,
};

const FormRenderer = ({ fields, form, setForm, options, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    const clean = name === "phoneNo" ? value.replaceAll(/\D/g, "") : value
    setForm((prev) => ({ ...prev, [name]: clean }))
  }

  const toggle = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value],
    }))
  }

  const renderField = (f) => {
    if (["text", "email", "password", "phone"].includes(f.type))
      return <TextField key={f.name} f={f} form={form} handleChange={handleChange} errors={errors} />
    if (f.type === "textarea")
      return <TextareaField key={f.name} f={f} form={form} handleChange={handleChange} errors={errors} />
    if (f.type === "select")
      return <SelectField key={f.name} f={f} form={form} handleChange={handleChange} options={options} errors={errors} />
    if (f.type === "status")
      return <StatusField key={f.name} f={f} form={form} setForm={setForm} errors={errors} />
    if (f.type === "multicheck")
      return <MulticheckField key={f.name} f={f} form={form} toggle={toggle} options={options} errors={errors} />
    return null
  }

  return <div className="space-y-4">{fields.map(renderField)}</div>
}

FormRenderer.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  options: PropTypes.object,
  errors: PropTypes.object,
}

export default FormRenderer