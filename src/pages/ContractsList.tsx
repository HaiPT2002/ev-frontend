import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getContracts } from '../api/api'

export default function ContractsList() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await getContracts()
        if (mounted) setContracts(data)
      } catch (err) {
        console.error('Failed to fetch contracts', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div>Loading contracts...</div>

  return (
    <div>
      <h2>Sale Contracts</h2>
      <p>List contracts, search by status, buyer, dealer. Route: /contracts</p>
      <ul>
        {contracts.map((c: any) => (
          <li key={c.id}>
            <Link to={`/contracts/${c.id}`}>{c.id} — {c.status || 'N/A'}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
