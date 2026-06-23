"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import api from "@/services/api";
import AddModal from "@/components/common/AddModal";
import FormRenderer from "@/components/common/FormRenderer";
import CommonListPage from "./CommonListPage";

const CommonListModal = ({
  modelName,
  keys = [],
  enableToggle = false,
  sizePerPage = 10,

  addFields = [],
  addInitialForm = {},
  addValidate,
  addOptions = {},
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(addInitialForm);
  const [addErrors, setAddErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const displayName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  const openAddModal = () => {
    setAddForm(addInitialForm);
    setAddErrors({});
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddErrors({});
  };

  const handleAddSubmit = async () => {
    if (addValidate) {
      const err = addValidate(addForm);
      if (err && Object.keys(err).length) {
        setAddErrors(err);
        return;
      }
    }

    try {
      setAddLoading(true);
      setAddErrors({});

      const res = await api.post(`/${modelName}/add`, addForm);

      if (res.data?.success === false) {
        setAddErrors({ api: res.data.message || "Failed to save." });
        return;
      }

      setShowAddModal(false);
      setRefreshSignal((v) => v + 1);
    } catch (err) {
      console.error("Error adding:", err);
      setAddErrors({ api: "Server error. Please try again." });
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <>
      <AddModal
        open={showAddModal}
        title={`Add ${displayName}`}
        loading={addLoading}
        onClose={closeAddModal}
        onSubmit={handleAddSubmit}
      >
        <FormRenderer
          fields={addFields}
          form={addForm}
          setForm={setAddForm}
          errors={addErrors}
          options={addOptions}
          columns={2}
        />

        {addErrors.api && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {addErrors.api}
          </div>
        )}
      </AddModal>

      <CommonListPage
        modelName={modelName}
        keys={keys}
        enableToggle={enableToggle}
        sizePerPage={sizePerPage}
        onAddClick={openAddModal}
        refreshSignal={refreshSignal}
      />
    </>
  );
};

CommonListModal.propTypes = {
  modelName: PropTypes.string.isRequired,
  keys: PropTypes.array,
  enableToggle: PropTypes.bool,
  sizePerPage: PropTypes.number,

  addFields: PropTypes.array,
  addInitialForm: PropTypes.object,
  addValidate: PropTypes.func,
  addOptions: PropTypes.object,
};

export default CommonListModal;