'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/services/api'
import AddPage from '@/components/common/AddPage'

export default function UserAdd() {

  const router = useRouter()
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.post('/role/list', { page: 0, sizePerPage: 50 })
        setRoles(
          (res.data.dtoList || []).map((r) => ({
            identifier: r.identifier,
            label: r.name || r.identifier,
          }))
        )
      } catch (err) {
        console.error(err)
      }
    }
    fetchRoles()
  }, [])

  const validate = (form) => {
    const errors = {}
    const nameRegex = /^[A-Za-z\s]+$/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^\d{10}$/
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/
    const HINT = 'Must have 8+ chars, uppercase, lowercase and number'

    if (form.name.trim().length < 3) errors.name = 'Minimum 3 characters'
    else if (!nameRegex.test(form.name)) errors.name = 'Only letters allowed'

    if (!emailRegex.test(form.username)) errors.username = 'Invalid email address'
    if (!phoneRegex.test(form.phoneNo)) errors.phoneNo = 'Invalid phone number'
    if (!passwordRegex.test(form.password)) errors.password = HINT
    if (form.roles.length === 0) errors.roles = 'Select at least one role'

    return errors
  }

  return (
    <AddPage
      title="Add User"
      modelName="user"
      options={{ roles }}
      fields={[
        { name: 'name',     label: 'Full Name',     type: 'text'       },
        { name: 'username', label: 'Email',          type: 'email'      },
        { name: 'phoneNo',  label: 'Phone Number',   type: 'phone'      },
        { name: 'password', label: 'Password',       type: 'password'   },
        { name: 'roles',    label: 'Roles',          type: 'multicheck' },
      ]}
      initialForm={{
        name: '',
        username: '',
        phoneNo: '',
        password: '',
        roles: [],
      }}
      validate={validate}
      onSuccess={() => router.push('/user/list')}
      onCancel={() => router.push('/user/list')}
    />
  )
}