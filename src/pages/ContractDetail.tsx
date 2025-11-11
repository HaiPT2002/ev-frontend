import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getContractById } from '../api/api'

export default function ContractDetail() {
  const { id } = useParams()
  const [contract, setContract] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!id) return
    ;(async () => {
      try {
        const data = await getContractById(id)
        if (mounted) setContract(data)
      } catch (err) {
        console.error('Failed to fetch contract', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading contract...</div>
  if (!contract) return <div>Contract not found.</div>

  return (
    <div>
      <h2>Contract Detail</h2>
      <p>Contract ID: {contract.id}</p>
      <p>Status: {contract.status}</p>
      <p>Buyer: {contract.buyerName}</p>
      <p>Dealer: {contract.dealerId}</p>
      <p>Payment status: {contract.paymentStatus}</p>
    </div>
  )
}
