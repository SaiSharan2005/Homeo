import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function StaffHome(){
    const navigate = useNavigate()
    navigate("/GetAllAppointment")
  return (
    <div>StaffHome</div>
  )
}
