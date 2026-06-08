"use client";

const FormRenderer = ({
  fields,
  form,
  setForm,
  options,
}) => {
  const handleChange = (e) => {
    setForm((prev) => ({...prev,[e.target.name]: e.target.value,}));
  };

  const toggle = (name, value) => {
    setForm((prev) => ({...prev,[name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value): [...prev[name], value],
    }));
  };

  return (
    <div className="space-y-4">
      {fields.map((f) => {
        if (f.type === "text") {
          return (
            <div key={f.name}>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {f.label}
              </label>

              <input
                type="text"
                name={f.name}
                value={form[f.name] ?? ""}
                onChange={handleChange}
                placeholder={f.label}
                disabled={f.disabled}
                className={`border p-3 w-full rounded-lg outline-none transition ${
                  f.disabled
                    ? "bg-gray-100 cursor-not-allowed text-gray-500"
                    : "focus:ring-2 focus:ring-blue-400"
                }`}
              />
            </div>
          );
        }
        if (f.type === "textarea") {
            return (
              <div key={f.name}>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {f.label}
                </label>

                <textarea
                  name={f.name}
                  value={form[f.name] ?? ""}
                  onChange={handleChange}
                  placeholder={f.label}
                  rows={4}
                  disabled={f.disabled}
                  className={`border p-3 w-full rounded-lg outline-none transition ${
                    f.disabled
                      ? "bg-gray-100 cursor-not-allowed text-gray-500"
                      : "focus:ring-2 focus:ring-blue-400"
                  }`}
                />
              </div>
            );
          }


        if (f.type === "select") {
          return (
            <div key={f.name}>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {f.label}
              </label>

              <select
                name={f.name}
                value={form[f.name] ?? ""}
                onChange={handleChange}
                className="border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">
                  Select {f.label}
                </option>

                {(options[f.name] || []).map((o) => (
                  <option
                    key={o.identifier}
                    value={o.identifier}
                  >
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (f.type === "status") {
          return (
            <div key={f.name}>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {f.label}
              </label>

              <select
                name={f.name}
                value={String(form[f.name])}
                onChange={(e) =>
                  setForm((prev) => ({...prev,[f.name]: 
                    e.target.value === "true",}))
                }
                className="border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="true">
                  Active
                </option>

                <option value="false">
                  Inactive
                </option>
              </select>
            </div>
          );
        }

        if (f.type === "multicheck") {
          return (
            <div key={f.name}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {f.label}
              </label>

              <div className="border rounded-lg p-3 max-h-32 overflow-y-auto bg-gray-50">
                {(options[f.name] || []).map((o) => (
                  <label key={o.identifier}
                    className="flex items-center gap-2 py-1"
                  >
                    <input type="checkbox" checked={form[f.name]?.includes(
                        o.identifier
                      )}
                      onChange={() => toggle(f.name, o.identifier)
                      }
                    />
                    <span className="text-sm">
                      {o.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default FormRenderer;