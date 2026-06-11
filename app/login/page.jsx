'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import api from '@/services/api'

const LoginPage = () => {

  const router = useRouter()
  const [credentials, setCredentials] = useState({username: '',password: ''})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleChange = (e) => {setCredentials({...credentials,
      [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await api.post('/authenticate',credentials)
      const data = res.data
      const token = data?.token
      const roles = data?.roles || []
      if (!token ||token === 'Error') {
        setMessage(data?.message ||'Invalid username or password')
        setMessageType('error')
      } else {
        localStorage.setItem('token',token)
        localStorage.setItem('username',credentials.username)
        localStorage.setItem('userRoles',JSON.stringify(roles))
        setMessage('Login successful')
        setMessageType('success')
        setTimeout(() => {router.push('/dashboard')
        }, 800)
      }
    } catch (err) {
      console.error(err)
      setMessage(err?.response?.data?.message ||
        'Server error. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to your POS account
        </p>

        {
          message && (
            <div
              className={`mb-4 p-3 rounded-xl text-sm font-medium text-center ${
                messageType === 'error'
                  ? 'bg-red-100 text-red-600':
                  'bg-green-100 text-green-700'}`}
            >
              {message}
            </div>
          )
        }

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="login-username" className="text-sm text-gray-600 font-medium">
              Email
            </label>

            <input
              id="login-username"
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          <div>

            <label htmlFor="login-password" className="text-sm text-gray-600 font-medium">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage