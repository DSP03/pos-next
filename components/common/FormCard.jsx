const FormCard = ({
  title,
  children,
  actions
}) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {title}
      </h2>

      <div className="space-y-4">
        {children}
      </div>

      {actions && (
        <div className="mt-6 flex gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default FormCard;