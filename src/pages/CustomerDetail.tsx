import React from 'react'
import { useParams } from 'react-router-dom'

export default function CustomerDetail() {
  const { phone } = useParams()
  return (
    <div>
      <h2>Customer Detail</h2>
      <p>Phone: {phone}</p>
      <p>Customer info and purchase history.</p>
    </div>
  )
}
