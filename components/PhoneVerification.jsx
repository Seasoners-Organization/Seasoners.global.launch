import { useState } from 'react';

export default function PhoneVerification({ userId, initialPhone, verified, onVerified, showSkip = false }) {
  const [phone, setPhone] = useState(initialPhone || '');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(verified ? 'verified' : 'idle');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const sendCode = async () => {
    setError('');
    setStatus('sending');
    const res = await fetch('/api/auth/verify-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send', userId, phoneNumber: phone })
    });
    const data = await res.json();
    if (res.ok) {
      setSent(true);
      setStatus('code-sent');
    } else {
      setError(data.error || 'Failed to send code');
      setStatus('idle');
    }
  };

  const verifyCode = async () => {
    setError('');
    setStatus('verifying');
    const res = await fetch('/api/auth/verify-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', userId, phoneNumber: phone, code })
    });
    const data = await res.json();
    if (res.ok) {
      setStatus('verified');
      setSent(false);
      if (onVerified) onVerified();
    } else {
      setError(data.error || 'Verification failed');
      setStatus('code-sent');
    }
  };

  if (status === 'verified') {
    return <div className="rounded bg-green-50 border border-green-200 p-4 text-green-700">Phone number verified!</div>;
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Phone Number</label>
      <input
        type="tel"
        className="w-full border rounded px-3 py-2"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="+491234567890"
        disabled={status === 'sending' || status === 'verifying'}
      />
      {sent && (
        <div>
          <label className="block text-sm font-medium text-slate-700">Verification Code</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter code"
            disabled={status === 'verifying'}
          />
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2">
        {!sent && (
          <button
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
            onClick={sendCode}
            disabled={!phone || status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send Code'}
          </button>
        )}
        {sent && (
          <button
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
            onClick={verifyCode}
            disabled={!code || status === 'verifying'}
          >
            {status === 'verifying' ? 'Verifying...' : 'Verify'}
          </button>
        )}
        {showSkip && (
          <button
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
            type="button"
            onClick={() => setStatus('skipped')}
          >
            Skip for now
          </button>
        )}
      </div>
      {status === 'skipped' && <div className="text-slate-500 text-sm">You can verify your phone later in your profile.</div>}
    </div>
  );
}
