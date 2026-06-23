"use client";

import PropTypes from "prop-types";

const inputBase =
  "border p-3 w-full rounded-lg outline-none transition text-sm";
const inputFocus = "focus:ring-2 focus:ring-[#0097AC]";
const inputDisabled = "bg-gray-100 cursor-not-allowed text-gray-500";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const inputClass = (disabled) =>
  cx(inputBase, disabled ? inputDisabled : inputFocus);

const FieldLabel = ({ label, required }) => (
  <label className="block mb-1 text-sm font-medium text-gray-700">
    {label}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);
FieldLabel.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  required: PropTypes.bool,
};

const FieldError = ({ error }) =>
  error ? <p className="text-red-500 text-xs mt-1">{error}</p> : null;
FieldError.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const TextField = ({ f, value, onChange, error }) => (
  <div>
    <FieldLabel label={f.label} required={f.required} />
    <input
      type={f.type === "phone" ? "tel" : f.type}
      name={f.name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={f.placeholder ?? f.label}
      disabled={f.disabled}
      autoComplete={f.type === "password" ? "new-password" : undefined}
      inputMode={f.inputMode ?? (f.type === "phone" ? "numeric" : undefined)}
      pattern={f.type === "phone" ? String.raw`\d*` : undefined}
      maxLength={f.type === "phone" ? 10 : f.maxLength}
      min={f.min}
      max={f.max}
      step={f.step}
      className={inputClass(f.disabled)}
    />
    <FieldError error={error} />
  </div>
);
TextField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    inputMode: PropTypes.string,
    maxLength: PropTypes.number,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.number,
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const TextareaField = ({ f, value, onChange, error }) => (
  <div>
    <FieldLabel label={f.label} required={f.required} />
    <textarea
      name={f.name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={f.placeholder ?? f.label}
      rows={f.rows ?? 4}
      disabled={f.disabled}
      className={inputClass(f.disabled)}
    />
    <FieldError error={error} />
  </div>
);

TextareaField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number,
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const SelectField = ({ f, value, onChange, options, error }) => (
  <div>
    <FieldLabel label={f.label} required={f.required} />
    <select
      name={f.name}
      value={value ?? ""}
      onChange={onChange}
      disabled={f.disabled}
      className={cx(inputBase, f.disabled ? inputDisabled : inputFocus)}
    >
      <option value="">{f.placeholder ?? `Select ${f.label}`}</option>
      {(f.options ?? options?.[f.name] ?? []).map((o) => (
        <option key={o.identifier ?? o.value} value={o.identifier ?? o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <FieldError error={error} />
  </div>
);

SelectField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    options: PropTypes.array,
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
      })
    ),
    PropTypes.object,
  ]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const StatusField = ({ f, value, onDirectChange, error }) => (
  <div>
    <FieldLabel label={f.label} required={f.required} />
    <select
      name={f.name}
      value={String(value ?? true)}
      onChange={(e) => onDirectChange(f.name, e.target.value === "true")}
      className={cx(inputBase, inputFocus)}
    >
      <option value="true">Active</option>
      <option value="false">Inactive</option>
    </select>
    <FieldError error={error} />
  </div>
);

StatusField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onDirectChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const MulticheckField = ({ f, value, onToggle, options, error }) => (
  <div>
    <FieldLabel label={f.label} required={f.required} />
    <div className="border rounded-lg p-3 max-h-36 overflow-y-auto bg-gray-50 space-y-1">
      {(f.options ?? options?.[f.name] ?? []).map((o) => (
        <label
          key={o.identifier ?? o.value}
          className="flex items-center gap-2 py-0.5 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={Array.isArray(value) && value.includes(o.identifier ?? o.value)}
            onChange={() => onToggle(f.name, o.identifier ?? o.value)}
            className="accent-[#0097AC]"
          />
          <span className="text-sm">{o.label}</span>
        </label>
      ))}
    </div>
    <FieldError error={error} />
  </div>
);

MulticheckField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.array,
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
  onToggle: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
      })
    ),
    PropTypes.object,
  ]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const RadioField = ({ f, value, onChange, error }) => (
  <div>
    <FieldLabel label={f.label} required={f.required} />
    <div className="flex flex-wrap gap-4 pt-1">
      {(f.options ?? []).map((o) => (
        <label
          key={o.identifier ?? o.value}
          className="flex items-center gap-2 cursor-pointer text-sm"
        >
          <input
            type="radio"
            name={f.name}
            value={o.identifier ?? o.value}
            checked={value === (o.identifier ?? o.value)}
            onChange={onChange}
            className="accent-[#0097AC]"
          />
          {o.label}
        </label>
      ))}
    </div>
    <FieldError error={error} />
  </div>
);

RadioField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.array,
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const CheckboxField = ({ f, value, onDirectChange, error }) => (
  <div className="flex items-start gap-2 pt-1">
    <input
      type="checkbox"
      id={f.name}
      name={f.name}
      checked={Boolean(value)}
      onChange={(e) => onDirectChange(f.name, e.target.checked)}
      className="accent-[#0097AC] mt-0.5"
    />
    <div>
      <label htmlFor={f.name} className="text-sm font-medium text-gray-700 cursor-pointer">
        {f.label}
        {f.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <FieldError error={error} />
    </div>
  </div>
);

CheckboxField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onDirectChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const DateField = ({ f, value, onChange, error }) => (
  <div>
    <FieldLabel label={f.label} required={f.required} />
    <input
      type="date"
      name={f.name}
      value={value ?? ""}
      onChange={onChange}
      disabled={f.disabled}
      min={f.min}
      max={f.max}
      className={inputClass(f.disabled)}
    />
    <FieldError error={error} />
  </div>
);

DateField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const FileField = ({ f, onDirectChange, error }) => (
  <div>
    <FieldLabel label={f.label} required={f.required} />
    <input
      type="file"
      name={f.name}
      accept={f.accept}
      multiple={f.multiple}
      disabled={f.disabled}
      onChange={(e) =>
        onDirectChange(f.name, f.multiple ? e.target.files : e.target.files[0])
      }
      className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4
        file:rounded file:border-0 file:text-sm file:font-medium
        file:bg-[#0097AC] file:text-white hover:file:bg-[#007a8c] cursor-pointer"
    />
    <FieldError error={error} />
  </div>
);

FileField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
  }).isRequired,
  onDirectChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const SectionField = ({ f, form, setForm, options, errors }) => {
  const nestedForm = form[f.name] ?? {};
  const sectionError = typeof errors?.[f.name] === "string" ? errors[f.name] : null;
  const nestedErrors = typeof errors?.[f.name] === "object" && errors?.[f.name] !== null ? errors[f.name] : {};

  const setNested = (updater) =>
    setForm((prev) => ({
      ...prev,
      [f.name]: updater(prev[f.name] ?? {}),
    }));

  return (
    <div className={cx(
      "border rounded-xl p-4 bg-gray-50",
      sectionError ? "border-red-400" : "border-gray-200"
    )}>
      <div className="flex items-center justify-between mb-4">
        {f.label && (
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {f.label}
          </h3>
        )}
        {sectionError && (
          <p className="text-red-500 text-xs font-medium">{sectionError}</p>
        )}
      </div>
      <FormRenderer
        fields={f.fields}
        form={nestedForm}
        setForm={setNested}
        options={options}
        errors={nestedErrors}
        _nested
      />
    </div>
  );
};

SectionField.propTypes = {
  f: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    fields: PropTypes.array,
  }).isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  options: PropTypes.object,
  errors: PropTypes.object,
};

const FormRenderer = ({
  fields,
  form,
  setForm,
  options = {},
  errors = {},
  columns = 1,
  _nested = false,
}) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let clean = value;
    if (name === "phoneNo" || type === "phone")
      clean = value.replaceAll(/\D/g, "");
    if (type === "number") clean = value === "" ? "" : Number(value);
    setForm((prev) => ({ ...prev, [name]: clean }));
  };

  const onDirectChange = (name, val) =>
    setForm((prev) => ({ ...prev, [name]: val }));

  const onToggle = (name, val) =>
    setForm((prev) => {
      const arr = Array.isArray(prev[name]) ? prev[name] : [];
      return {
        ...prev,
        [name]: arr.includes(val)
          ? arr.filter((v) => v !== val)
          : [...arr, val],
      };
    });

  const renderField = (f, idx) => {
    const value = form[f.name];
    const error = errors[f.name];
    const props = { f, value, error };

    if (f.type === "section")
      return (
        <div key={f.name} className={columns > 1 ? "col-span-full" : ""}>
          <SectionField
            f={f}
            form={form}
            setForm={setForm}
            options={options}
            errors={errors}
          />
        </div>
      );

    if (f.type === "divider")
      return (
        <div
          key={f.name ?? `divider-${idx}`}
          className={cx(
            "col-span-full border-t border-gray-200 my-1",
            f.label && "pt-2"
          )}
        >
          {f.label && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {f.label}
            </p>
          )}
        </div>
      );

    const isSpanFull = f.span === "full" || f.type === "textarea";
    const wrapper = (child) => (
      <div key={f.name} className={isSpanFull && columns > 1 ? "col-span-full" : ""}>
        {child}
      </div>
    );

    if (["text", "email", "password", "phone", "number"].includes(f.type))
      return wrapper(<TextField {...props} onChange={handleChange} />);
    if (f.type === "textarea")
      return wrapper(<TextareaField {...props} onChange={handleChange} />);
    if (f.type === "select")
      return wrapper(
        <SelectField {...props} onChange={handleChange} options={options} />
      );
    if (f.type === "status")
      return wrapper(<StatusField {...props} onDirectChange={onDirectChange} />);
    if (f.type === "multicheck")
      return wrapper(
        <MulticheckField {...props} onToggle={onToggle} options={options} />
      );
    if (f.type === "radio")
      return wrapper(<RadioField {...props} onChange={handleChange} />);
    if (f.type === "checkbox")
      return wrapper(
        <CheckboxField {...props} onDirectChange={onDirectChange} />
      );
    if (f.type === "date")
      return wrapper(<DateField {...props} onChange={handleChange} />);
    if (f.type === "file")
      return wrapper(
        <FileField {...props} onDirectChange={onDirectChange} />
      );

    return null;
  };

  const gridClass =
    columns > 1
      ? `grid grid-cols-1 sm:grid-cols-${columns} gap-4`
      : "space-y-4";

  return (
    <div className={gridClass}>
      {fields.map((f, idx) => renderField(f, idx))}
    </div>
  );
};

FormRenderer.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      required: PropTypes.bool,
      options: PropTypes.array,
      fields: PropTypes.array,
      span: PropTypes.string,
      rows: PropTypes.number,
      placeholder: PropTypes.string,
      min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      step: PropTypes.number,
      maxLength: PropTypes.number,
      accept: PropTypes.string,
      multiple: PropTypes.bool,
    })
  ).isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  options: PropTypes.object,
  errors: PropTypes.object,
  columns: PropTypes.number,
  _nested: PropTypes.bool,
};

export default FormRenderer;