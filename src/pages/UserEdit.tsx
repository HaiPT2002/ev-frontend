import React from 'react'
import { useParams } from 'react-router-dom'

export default function UserEdit() {
  const { id } = useParams()
  return (
    <div>
      <h2>User Edit</h2>
      <p>User ID: {id}</p>
      <p>Edit roles, assign dealer.
      </p>
    </div>
  )
}
