import { useEffect, useMemo, useState } from 'react';
import { COUNTRY_CODES } from '@/utils/countryCodes';
import { detectDefaultCountryIso } from '@/utils/localeCountry';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';

export default function PhoneVerification({ userId, initialPhone, verified, onVerified, showSkip = false }) {
  const [countryIso, setCountryIso] = useState('AT');
  const [localNumber, setLocalNumber] = useState('');
  const [phone, setPhone] = useState(initialPhone || '');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(verified ? 'verified' : 'idle');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // Initialize localNumber/countryCode from initialPhone if provided
    if (initialPhone && initialPhone.startsWith('+')) {
      // naive split: country code up to 4 digits
      const parsed = parsePhoneNumberFromString(initialPhone);
      if (parsed) {
        setCountryIso(parsed.country || 'AT');
        // Set national part formatted for display
        setLocalNumber(parsed.nationalNumber || initialPhone.replace(/^\+\d{1,4}/, ''));
      }
    } else {
      // Auto-detect country code from browser locale
      const detectedIso = detectDefaultCountryIso();
      if (detectedIso) setCountryIso(detectedIso);
    }
  }, [initialPhone]);

  // Fallback: auto-load current user's phone if not provided
  useEffect(() => {
    if (!initialPhone && !localNumber) {
      const controller = new AbortController();
      (async () => {
        try {
          const res = await fetch('/api/user/me', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
          });
          if (!res.ok) return;
          const data = await res.json();
          const phoneNum = data?.phoneNumber || data?.phone || null;
          if (phoneNum) {
            const parsed = parsePhoneNumberFromString(phoneNum);
            if (parsed) {
              setCountryIso(parsed.country || detectDefaultCountryIso());
              setLocalNumber(parsed.nationalNumber || '');
              setPhone(`${parsed.countryCallingCode ? '+' + parsed.countryCallingCode : ''}${parsed.nationalNumber || ''}`);
            }
          }
        } catch (_) {
          // ignore
        }
      })();
      return () => controller.abort();
    }
  }, [initialPhone, localNumber]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    }
    return () => timer && clearInterval(timer);
  }, [cooldown]);

  const selectedEntry = COUNTRY_CODES.find(e => e.iso === countryIso) || COUNTRY_CODES.find(e => e.code === '+43');
  const countryCode = selectedEntry?.code || '+43';

  const isValid = useMemo(() => {
    const digits = (localNumber || '').replace(/\D/g, '');
    const e164 = `${countryCode}${digits}`;
    try {
      const p = parsePhoneNumberFromString(e164);
      return !!p && p.isValid();
    } catch (e) {
      return false;
    }
  }, [countryCode, localNumber]);

  const exampleFormatted = useMemo(() => {
    try {
      const ayt = new AsYouType(countryIso);
      return `+${(countryCode || '+').replace('+', '')} ${ayt.input('1234567890')}`;
    } catch {
      return `${countryCode} 1234567890`;
    }
  }, [countryIso, countryCode]);

  const formattedE164 = () => {
    const digits = (localNumber || '').replace(/\D/g, '');
    return `${countryCode}${digits}`;
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
    try {
      const res = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', userId: userId || undefined, phoneNumber: e164 })
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setStatus('code-sent');
        setCooldown(60);
        setPhone(e164);
        setCode('');
      } else {
        setError(data.error || 'Failed to send code. Please try again.');
        setStatus('idle');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setStatus('idle');
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }
    setError('');
    setStatus('verifying');
    const e164 = phone || formattedE164();
    if (!isValidPhone(e164)) {
      setError('Invalid phone number format');
      setStatus('code-sent');
      return;
    }
    try {
      const res = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', userId: userId || undefined, phoneNumber: e164, code })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('verified');
        setSent(false);
        setCode('');
        if (onVerified) onVerified(e164);
      } else {
        setError(data.error || 'Invalid or expired code. Please try again.');
        setStatus('code-sent');
        setCode('');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setStatus('code-sent');
    }
  };

  if (status === 'verified') {
    return (
      <div className="space-y-3">
        <div className="rounded bg-green-50 border border-green-200 p-4 text-green-700 flex items-center gap-2">
          <span className="text-xl">✓</span>
          <div>
            <p className="font-semibold">Phone number verified!</p>
            <p className="text-sm text-green-600">{phone}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setPhone('');
            setCode('');
            setLocalNumber('');
            setSent(false);
            setError('');
          }}
          className="text-sm text-slate-600 hover:text-slate-800 underline"
        >
          Change phone number
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Phone Number</label>
      
      <select
        className="border rounded px-3 py-2 w-full"
        value={countryIso}
        onChange={(e) => {
          const iso = e.target.value;
          setCountryIso(iso);
          try {
            const ayt = new AsYouType(iso);
            const formatted = ayt.input((localNumber || '').replace(/\D/g, ''));
            const national = formatted.replace(/^\+?\d+\s*/, '');
            setLocalNumber(national);
          } catch {
            // noop
          }
        }}
        disabled={status === 'sending' || status === 'verifying'}
      >
        {COUNTRY_CODES.map(({ code, name, flag, iso }) => (
          <option key={`${iso || code}-${name}`} value={iso || code}>
            {flag ? `${flag} ` : ''}{name} {code}
          </option>
        ))}
      </select>

      <input
        type="tel"
        className={`w-full border rounded px-3 py-2 ${
          localNumber && !isValid ? 'border-red-400 bg-red-50' : ''
        }`}
        value={localNumber}
        onChange={e => {
          const raw = e.target.value.replace(/\D/g, '');
          if (countryIso) {
            const ayt = new AsYouType(countryIso);
            const formatted = ayt.input(raw);
            setLocalNumber(formatted.replace(/^\+?\d+\s*/, '') || raw);
          } else {
            setLocalNumber(raw);
          }
        }}
        placeholder={'Enter phone number'}
        disabled={status === 'sending' || status === 'verifying' || sent}
      />

      <div className="space-y-1">
        {selectedEntry && !sent && (
          <p className="text-xs text-slate-500">Example: {exampleFormatted}</p>
        )}
        {localNumber && !isValid && (
          <p className="text-xs text-red-600">Invalid phone format for selected country.</p>
        )}
      </div>
      {phone && sent && (
        <p className="text-xs text-slate-600 bg-blue-50 px-3 py-2 rounded border border-blue-200">
          <span className="font-semibold">Code sent to:</span> {phone}
        </p>
      )}
      {sent && (
        <div>
          <label className="block text-sm font-medium text-slate-700">Verification Code</label>
          <input
            type="text"
            className={`w-full border rounded px-3 py-2 ${
              error ? 'border-red-400 bg-red-50' : ''
            }`}
            value={code}
            onChange={e => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 7);
              setCode(digits);
              setError('');
            }}
            placeholder="0000000"
            maxLength="7"
            disabled={status === 'verifying'}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && code.trim() && status !== 'verifying') {
                verifyCode();
              }
            }}
          />
          <p className="text-xs text-slate-500 mt-1">Check your SMS for the code. It may take a moment to arrive.</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-red-700 text-sm flex items-start gap-2">
          <span className="text-red-500 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}
      <div className="flex gap-2">
        {!sent && (
          <button
            type="button"
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            onClick={sendCode}
            disabled={!localNumber || !isValid || status === 'sending' || cooldown > 0}
          >
            {status === 'sending' ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send Code'}
          </button>
        )}
        {sent && (
          <button
            type="button"
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
            onClick={verifyCode}
            disabled={!code.trim() || status === 'verifying'}
          >
            {status === 'verifying' ? 'Verifying...' : 'Verify'}
          </button>
        )}
        {showSkip && !sent && (
          <button
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
            type="button"
            onClick={() => setStatus('skipped')}
          >
            Skip for now
          </button>
        )}
      </div>
      
      {status === 'skipped' && (
        <div className="text-slate-500 text-sm">You can verify your phone later in your profile.</div>
      )}
    </div>
  );
}
