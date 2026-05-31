'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

const C = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  bg: '#FAFAFC',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  errorBg: '#FEF2F2',
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.875rem',
  borderRadius: '8px',
  border: `1px solid ${C.border}`,
  fontSize: '0.9rem',
  color: C.text,
  backgroundColor: C.surface,
  outline: 'none',
  boxSizing: 'border-box' as const,
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = C.primary;
    e.target.style.boxShadow = `0 0 0 3px ${C.primaryLight}`;
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = C.border;
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', color: C.primary }}>
              About Time
            </div>
          </Link>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: C.surface, borderRadius: '16px', border: `1px solid ${C.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '2.25rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: C.text, marginTop: 0, marginBottom: '0.4rem', textAlign: 'center' }}>
            Create your account
          </h1>
          <p style={{ color: C.textSecondary, fontSize: '0.9rem', textAlign: 'center', marginTop: 0, marginBottom: '1.75rem' }}>
            Start organizing your time with AI
          </p>

          {error && (
            <div style={{ backgroundColor: C.errorBg, color: C.error, padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.25rem', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>
                Name <span style={{ color: C.textSecondary, fontWeight: 400 }}>(optional)</span>
              </label>
              <input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>
                Email
              </label>
              <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>
                Password
              </label>
              <input id="password" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: C.text, marginBottom: '0.4rem' }}>
                Confirm password
              </label>
              <input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: isLoading ? '#9CA3AF' : C.primary, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '0.25rem' }}
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: C.textSecondary, marginTop: '1.5rem', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: C.primary, fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
