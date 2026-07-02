'use client'

import { useState } from 'react'
import PropTypes from 'prop-types'
import api from '@/services/api'
import FormRenderer from './FormRenderer'
import Layout from '@/components/common/Layout'

const AddPage = ({
  title,
  modelName,
  fields,
  options = {},
  initialForm,
  validate,
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError('')
    setSuccess('')
    setFieldErrors({})

    const validation = validate?.(form)

    if (validation && typeof validation === 'object' && Object.keys(validation).length > 0) {
      setFieldErrors(validation)
      return
    }

    if (validation && typeof validation === 'string') {
      setError(validation)
      return
    }

    setLoading(true)
    try {
      const res = await api.post(`/${modelName}/add`, form,{skipAuthRedirect: true})
      if (res.data?.success === false) {
        setError(res.data.message || 'Failed')
        return
      }
      setSuccess('Saved successfully')
      setTimeout(() => { onSuccess?.() }, 700)
    } catch (e) {
      console.log(e)
      
      console.log(e.response);
  console.log(e.response?.data);
  console.log(e.response?.data?.message);
      setError(e.response?.data?.message||'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
      <Layout>
        <div className="min-h-screen bg-[#F2F7F8] p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-[#D9E5E7]">
              {/* HEADER */}
              <div className="bg-gradient-to-r from-[#003C51] to-[#006E74] px-8 py-6">
                <h2 className="text-3xl font-bold text-white">{title}</h2>
                <p className="text-cyan-100 mt-1 text-sm">
                  Create and save new records easily
                </p>
              </div>
              {/* BODY */}
              <div className="p-8 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl shadow-sm">
                    <div className="font-semibold">Error</div>
                    <div className="text-sm mt-1">{error}</div>
                  </div>
                )}
                {success && (
                  <div className="bg-cyan-50 border border-cyan-200 text-[#006E74] px-4 py-3 rounded-2xl shadow-sm">
                    <div className="font-semibold">Success</div>
                    <div className="text-sm mt-1">{success}</div>
                  </div>
                )}
                {/* FORM */}
                <div className="bg-white rounded-2xl p-6 border border-[#D9E5E7] shadow-sm">
                  <FormRenderer
                    fields={fields}
                    form={form}
                    setForm={setForm}
                    options={options}
                    errors={fieldErrors}
                  />
                </div>
                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="button"
                    onClick={submit}
                    disabled={loading}
                    className={`flex-1 py-3 rounded-2xl font-semibold text-white transition-all duration-300 shadow-lg ${
                      loading
                        ? 'bg-[#7A7480] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#0097AC] to-[#006E74] hover:scale-[1.02] hover:shadow-xl'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl font-semibold border border-[#006E74] text-[#006E74] hover:bg-[#F2F7F8] transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
  )
}

export default AddPage

AddPage.propTypes = {
  title: PropTypes.string.isRequired,
  modelName: PropTypes.string.isRequired,
  fields: PropTypes.array,
  options: PropTypes.object,
  initialForm: PropTypes.object,
  validate: PropTypes.func,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
}

AddPage.defaultProps = {
  fields: [],
  options: {},
  initialForm: {},
}