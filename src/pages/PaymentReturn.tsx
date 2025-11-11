import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { verifyVnPayReturn } from '../api/api';
import { useError } from '../contexts/ErrorContext';

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | 'error'>('pending');
  const [message, setMessage] = useState('Verifying...');

  const { showError } = useError();

  useEffect(() => {
    // The backend VnPayController provides /api/payment/vnpay/return which verifies signature.
    const params: Record<string, string> = {};
    const raw = window.location.search || '';
    const urlParams = new URLSearchParams(raw);
    // iterate parameters using forEach to avoid TS lib mismatch for .keys()
    urlParams.forEach((value, key) => {
      if (value !== null) params[key] = value;
    });

    if (!params['vnp_TxnRef']) {
      setStatus('error');
      setMessage('Missing vnp_TxnRef');
      return;
    }

    (async () => {
      try {
        const res = await verifyVnPayReturn(params);
        // VnPayController returns structured result with signature validity and message
        setStatus(res.signatureValid ? 'success' : 'failed');
        setMessage(res.message || JSON.stringify(res));
      } catch (err: any) {
        setStatus('error');
        const m = err?.message || 'Verification failed';
        setMessage(m);
        showError('Payment verification failed: ' + m);
      }
    })();
  }, []);

  return (
    <div>
      <h2>Payment Result</h2>
      <p>Status: {status}</p>
      <p>{message}</p>
    </div>
  );
}
