import { useEffect, useState } from 'react';
import { COUNTRY_CODES } from '@/utils/countryCodes';
import { detectDefaultCountryCode } from '@/utils/localeCountry';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default function PhoneVerification({ userId, initialPhone, verified, onVerified, showSkip = false }) {
  const [countryCode, setCountryCode] = useState('+43');
  const [localNumber, setLocalNumber] = useState('');
  const [phone, setPhone] = useState(initialPhone || '');
  const [code, setCode] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [status, setStatus] = useState(verified ? 'verified' : 'idle');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // Initialize localNumber/countryCode from initialPhone if provided
    if (initialPhone && initialPhone.startsWith('+')) {
      // naive split: country code up to 4 digits
      const match = initialPhone.match(/^(\+\d{1,4})(\d.*)$/);
      if (match) {
        setCountryCode(match[1]);
        setLocalNumber(match[2]);
      }
    } else {
      // Auto-detect country code from browser locale
      const detected = detectDefaultCountryCode();
      if (detected) setCountryCode(detected);
    }
  }, [initialPhone]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    }
    return () => timer && clearInterval(timer);
  }, [cooldown]);

  const formattedE164 = () => {
    const digits = (localNumber || '').replace(/\D/g, '');
    const cc = (countryCode || '+').replace(/[^+\d]/g, '');
    return `${cc}${digits}`;
  };

  const isValidPhone = (e164) => {
    try {
      const phone = parsePhoneNumberFromString(e164);
      return !!phone && phone.isValid();
    } catch (e) {
      return false;
    }
  };

  const sendCode = async () => {
    setError('');
    setStatus('sending');
    const e164 = formattedE164();
    if (!isValidPhone(e164)) {
      setError('Invalid phone number format for selected country');
      setStatus('idle');
      return;
    }
    const res = await fetch('/api/auth/verify-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send', userId, phoneNumber: e164 })
    });
    const data = await res.json();
    if (res.ok) {
      setSent(true);
      setStatus('code-sent');
      setCooldown(60);
      setPhone(e164);
    } else {
      setError(data.error || 'Failed to send code');
      setStatus('idle');
    }
  };

  const verifyCode = async () => {
    setError('');
    setStatus('verifying');
    const e164 = phone || formattedE164();
    if (!isValidPhone(e164)) {
      setError('Invalid phone number format');
      setStatus('code-sent');
      return;
    }
    const res = await fetch('/api/auth/verify-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', userId, phoneNumber: e164, code })
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
      <div className="flex gap-2">
        <div className="flex flex-col w-60">
        <input
          type="text"
          className="border rounded px-2 py-2 mb-2"
          value={countryQuery}
          onChange={(e) => setCountryQuery(e.target.value)}
          placeholder="Search country"
          disabled={status === 'sending' || status === 'verifying'}
        />
        <select
          className="border rounded px-2 py-2 w-44"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          disabled={status === 'sending' || status === 'verifying'}
        >
          {COUNTRY_CODES.filter(({ name, code }) => {
            const q = countryQuery.toLowerCase();
            return !q || name.toLowerCase().includes(q) || code.includes(q);
          }).map(({ code, name, flag }) => (
            <option key={`${code}-${name}`} value={code}>
              {flag ? `${flag} ` : ''}{name} {code}
            </option>
          ))}
        </select>
        </div>
        <input
          type="tel"
          className="flex-1 border rounded px-3 py-2"
          value={localNumber}
          onChange={e => {
            // allow digits and spaces only
            const val = e.target.value.replace(/[^\d\s]/g, '');
            setLocalNumber(val);
          }}
          placeholder={'Enter local number'}
          disabled={status === 'sending' || status === 'verifying'}
        />
      </div>
      {phone && (
        <p className="text-xs text-slate-500">Sending to: {phone}</p>
      )}
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
            disabled={!localNumber || status === 'sending' || cooldown > 0}
          >
            {status === 'sending' ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send Code'}
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
