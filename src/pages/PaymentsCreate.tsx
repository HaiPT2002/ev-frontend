import React, { useState } from 'react'
import { createVnPayPayment } from '../api/api'

export default function PaymentsCreate() {
  const [amount, setAmount] = useState('')
  const [orderInfo, setOrderInfo] = useState('Purchase')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        amount: amount,
        orderInfo,
        txnRef: undefined,
        ipAddress: undefined
      }
      const res = await createVnPayPayment(payload)
      // Expect { paymentUrl }
      if (res && res.paymentUrl) {
        window.location.href = res.paymentUrl
      } else {
        alert('No payment URL returned')
      }
    } catch (err: any) {
      alert('Payment creation failed: ' + (err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Create Payment</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
        <input placeholder="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input placeholder="order info" value={orderInfo} onChange={(e) => setOrderInfo(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Payment'}</button>
      </form>
      <p>Route: /payments/create</p>
    </div>
  )
}
