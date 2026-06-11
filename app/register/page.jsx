'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/services/api'

export default function RegisterPage() {

  const router = useRouter()
  const [availableRoles, setAvailableRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [form, setForm] = useState({
    name: '',
    username: '',
    phoneNo: '',
    password: '',
    roles: []
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const fetchRoles = async () => {

      try {

        const res = await api.post('/role/list',
          {
            page: 0,
            sizePerPage: 50
          }
        )

        let roles = []

        if (Array.isArray(res.data.dtoList)) {
          roles = res.data.dtoList
        }
        const normalizedRoles = roles.map((r) => r.identifier)
        setAvailableRoles(normalizedRoles)

      } catch (err) {
        console.error(err)
        setMessage('Failed to load roles')
        setMessageType('error')
      } finally {
        setLoadingRoles(false)
      }
    }
    fetchRoles()
  }, [])

  const handleChange = (e) => {
    let value = e.target.value
    if (e.target.name === 'phoneNo') {
      value = value.replaceAll(/\D/g, '')
    }

    setForm({...form,[e.target.name]: value})
  }

  const toggleRole = (role) => {
    setForm((prev) => ({...prev,roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role]
    }))
  }

  const validate = () => {
    const nextErrors = {}
    const nameRegex =/^[A-Za-z\s]+$/
    const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
    const phoneRegex =/^\d\d{9}$/
    const passwordRegex =/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    const HINT ="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number";
    
    if (form.name.trim().length < 3) {
      nextErrors.name ='Minimum 3 characters'
    }

    else if (!nameRegex.test(form.name)) {
      nextErrors.name ='Only letters allowed'
    }

    if (!emailRegex.test(form.username)) {
      nextErrors.username ='Invalid email address'
    }

    if (!phoneRegex.test(form.phoneNo)) {
      nextErrors.phoneNo ='Invalid phone number'
    }

    if (!passwordRegex.test(form.password)){
      nextErrors.password = HINT
    }

    if (form.roles.length === 0) {
      nextErrors.roles ='Select at least one role'
    }

    setErrors(nextErrors)

    return (Object.keys(nextErrors).length === 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!validate()) {
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        username: form.username,
        phoneNo: form.phoneNo,
        password: form.password,
        roles: form.roles
      }

      const res = await api.post('/user/add',payload)
      setMessage(res?.data?.message ||'Registration successful')
      setMessageType('success')

      setTimeout(() => {router.push('/login')}, 1200)

    } catch (err) {
      console.error(err)
      setMessage(err?.response?.data?.message ||'Registration failed')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join your POS system
        </p>
        {
          message && (
            <div
              className={`mb-5 text-center p-3 rounded-xl text-sm font-medium ${
                messageType === 'error'
                  ? 'bg-red-100 text-red-600': 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )
        }

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {
              errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name}
                </p>
              )
            }
          </div>

          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              id="username"
              type="email"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {
              errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username}
                </p>
              )
            }
          </div>

          <div>
            <label htmlFor="phoneNo" className="block mb-2 text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <input
              id="phoneNo"
              type="text"
              name="phoneNo"
              value={form.phoneNo}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {
              errors.phoneNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNo}
                </p>
              )
            }
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {
              errors.password && (

                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )
            }
          </div>

          <div>
            <p className="text-sm mb-3 font-medium text-gray-700">
              Select Roles
            </p>

            {
              loadingRoles ? (
                <p className="text-gray-500 text-sm">
                  Loading roles...
                </p>
              ) : (

                <div className="grid grid-cols-2 gap-3">
                  {
                    availableRoles.map((role) => (
                      <label
                        key={role}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                          form.roles.includes(role)
                            ? 'bg-blue-100 border-blue-500'
                            : 'bg-white border-gray-300 hover:bg-blue-50'
                        }`}
                      >

                        <input
                          type="checkbox"
                          checked={form.roles.includes(role)}
                          onChange={() =>toggleRole(role)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {role}
                        </span>

                      </label>
                    ))
                  }
                </div>
              )
            }

            {
              errors.roles && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.roles}
                </p>
              )
            }

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-70"
          >
            {loading ? 'Creating account...': 'Sign Up'}
          </button>

        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline ml-1"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  )
}