import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getVehicles } from '../api/api'

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await getVehicles()
        if (mounted) setVehicles(data)
      } catch (err) {
        console.error('Failed to fetch vehicles', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div>Loading vehicles...</div>

  return (
    <div>
      <h2>Vehicles</h2>
      <p>Search/filter by model, brand, price. Route: /vehicles</p>
      <ul>
        {vehicles.map((v: any) => (
          <li key={v.id}>
            <Link to={`/vehicles/${v.id}`}>{v.manufacturer} {v.model} — {v.price}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
