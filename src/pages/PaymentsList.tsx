import React, { useEffect, useState } from 'react'
import { getPayments } from '../api/api'

export default function PaymentsList() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await getPayments()
        if (mounted) setPayments(data)
      } catch (err) {
        console.error('Failed to fetch payments', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return <div>Loading payments...</div>

  return (
    <div>
      <h2>Payments</h2>
      <p>List transactions, status, lookup by vnp_TxnRef. Route: /payments</p>
      <ul>
        {payments.map((p: any) => (
          <li key={p.id}>{p.id} — {p.status || 'N/A'} — {p.amount || ''}</li>
        ))}
      </ul>
    </div>
  )
}
