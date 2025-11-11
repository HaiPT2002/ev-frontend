import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getVehicleById } from '../api/api'

export default function VehicleDetail() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!id) return
    ;(async () => {
      try {
        const data = await getVehicleById(id)
        if (mounted) setVehicle(data)
      } catch (err) {
        console.error('Failed to fetch vehicle', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div>Loading vehicle...</div>
  if (!vehicle) return <div>Vehicle not found.</div>

  return (
    <div>
      <h2>Vehicle Detail</h2>
      <p>
        {vehicle.manufacturer} {vehicle.model} — {vehicle.price}
      </p>
      <p>Specs: Battery {vehicle.battery}, Range {vehicle.range} km.</p>
      <p>Actions: request test drive / create contract.</p>
    </div>
  )
}
