import { Resend } from 'resend';

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  try {
    return new Resend(key);
  } catch (e) {
    return null;
  }
}
