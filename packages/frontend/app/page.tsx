'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

const C = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  bg: '#FAFAFC',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  accent: '#14B8A6',
  border: '#E5E7EB',
};

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg }}>
        <div style={{ color: C.textSecondary }}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, color: C.text }}>

      {/* ── Nav ── */}
      <nav style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', color: C.primary }}>
          About Time
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href="/login" style={{ color: C.textSecondary, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 0.75rem' }}>
            Sign In
          </Link>
          <Link href="/register" style={{ backgroundColor: C.primary, color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero (2-column) ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'inline-flex', backgroundColor: C.primaryLight, color: C.primary, padding: '0.35rem 1rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 600, width: 'fit-content', letterSpacing: '0.02em' }}>
            AI-powered scheduling
          </div>

          <h1 style={{ fontSize: '3.75rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08, margin: 0 }}>
            <span style={{ color: C.textSecondary }}>It&apos;s</span>{' '}
            <span style={{ color: C.primary }}>about<br />time!</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: C.textSecondary, lineHeight: 1.65, margin: 0, maxWidth: '400px' }}>
            Turn your commitments into a realistic schedule — powered by AI.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
            <Link href="/register" style={{ backgroundColor: C.primary, color: '#fff', padding: '0.85rem 1.75rem', borderRadius: '10px', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, display: 'inline-block' }}>
              Get started free →
            </Link>
            <Link href="/login" style={{ backgroundColor: C.surface, color: C.text, padding: '0.85rem 1.75rem', borderRadius: '10px', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, display: 'inline-block', border: `1px solid ${C.border}` }}>
              Sign in
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.5rem' }}>
            {['No credit card', 'Free forever plan', '5 min setup'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: C.textSecondary }}>
                <span style={{ color: C.accent, fontWeight: 700 }}>✓</span> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right – mock schedule card */}
        <div style={{ backgroundColor: C.surface, borderRadius: '20px', padding: '1.75rem', boxShadow: '0 8px 32px rgba(79,70,229,0.10), 0 1px 4px rgba(0,0,0,0.04)', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.textSecondary, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            This week&apos;s schedule
          </div>
          {[
            { day: 'Mon', task: 'Deep work: Project X', time: '9:00 – 11:00am', color: C.primary },
            { day: 'Mon', task: 'Team standup', time: '11:00 – 11:30am', color: C.accent },
            { day: 'Tue', task: 'Gym session', time: '7:00 – 8:00am', color: C.accent },
            { day: 'Tue', task: 'Client review', time: '2:00 – 3:00pm', color: C.primary },
            { day: 'Wed', task: 'Focus block: writing', time: '9:00 – 12:00pm', color: C.primary },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '10px', marginBottom: '0.4rem', backgroundColor: i % 2 === 0 ? C.bg : C.surface }}>
              <div style={{ width: '30px', fontSize: '0.68rem', fontWeight: 700, color: C.textSecondary, flexShrink: 0 }}>{item.day}</div>
              <div style={{ width: '3px', height: '34px', borderRadius: '2px', backgroundColor: item.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: C.text }}>{item.task}</div>
                <div style={{ fontSize: '0.72rem', color: C.textSecondary, marginTop: '0.1rem' }}>{item.time}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: C.primaryLight, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem' }}>✨</span>
            <span style={{ fontSize: '0.8rem', color: C.primary, fontWeight: 500 }}>AI generated based on your context</span>
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section style={{ backgroundColor: C.surface, padding: '5rem 2rem', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: C.text, marginBottom: '0.5rem', marginTop: 0 }}>
            Everything you need to stay on track
          </h2>
          <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '3rem', marginTop: '0.5rem', fontSize: '1rem' }}>
            Powered by AI that understands your real life
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              {
                icon: '🎯',
                gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                shadow: 'rgba(79,70,229,0.25)',
                title: 'Set Your Context',
                desc: 'Tell us about your preferences, work schedule, and recurring activities',
              },
              {
                icon: '🤖',
                gradient: 'linear-gradient(135deg, #14B8A6 0%, #0891B2 100%)',
                shadow: 'rgba(20,184,166,0.25)',
                title: 'AI-Powered Planning',
                desc: 'Our AI generates personalized schedules based on your unique needs and energy levels',
              },
              {
                icon: '📤',
                gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                shadow: 'rgba(245,158,11,0.25)',
                title: 'Export & Share',
                desc: 'Download as PDF or sync with your calendar app to stay organized',
              },
            ].map((card) => (
              <div key={card.title} style={{ backgroundColor: C.bg, borderRadius: '16px', padding: '2rem', border: `1px solid ${C.border}` }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: card.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem', boxShadow: `0 6px 16px ${card.shadow}` }}>
                  {card.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: C.text, marginBottom: '0.5rem', marginTop: 0 }}>
                  {card.title}
                </h3>
                <p style={{ color: C.textSecondary, fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: C.text, marginBottom: '0.5rem', marginTop: 0 }}>
            How it works
          </h2>
          <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '4rem', marginTop: '0.5rem' }}>
            From commitments to calendar in minutes
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative' }}>
            {[
              { step: '1', icon: '📝', title: 'Tell us your commitments', desc: 'Work hours, recurring tasks, personal obligations' },
              { step: '2', icon: '⚙️', title: 'Define preferences', desc: 'Work style, energy levels, buffer time' },
              { step: '3', icon: '✨', title: 'Generate schedule', desc: 'AI creates a realistic weekly plan just for you' },
              { step: '4', icon: '📤', title: 'Export calendar', desc: 'Download PDF or sync with your calendar' },
            ].map((item, i) => (
              <div key={item.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 1rem', position: 'relative' }}>
                {/* Connecting line */}
                {i < 3 && (
                  <div style={{ position: 'absolute', top: '25px', left: 'calc(50% + 26px)', width: 'calc(100% - 52px)', height: '2px', background: `linear-gradient(90deg, ${C.primary}60, ${C.primaryLight})`, zIndex: 0 }} />
                )}
                {/* Number circle */}
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem', position: 'relative', zIndex: 1, boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h4 style={{ fontWeight: 700, fontSize: '0.92rem', color: C.text, marginBottom: '0.4rem', marginTop: 0 }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ backgroundColor: C.primary, padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginBottom: '1rem', marginTop: 0 }}>
          Ready to take control of your time?
        </h2>
        <p style={{ color: '#C7D2FE', fontSize: '1.05rem', marginBottom: '2rem', marginTop: 0 }}>
          Join thousands of people who plan smarter with About Time
        </p>
        <Link href="/register" style={{ backgroundColor: '#fff', color: C.primary, padding: '1rem 2.5rem', borderRadius: '10px', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 700, display: 'inline-block' }}>
          Start scheduling for free →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '2rem', textAlign: 'center', color: C.textSecondary, fontSize: '0.82rem', borderTop: `1px solid ${C.border}`, backgroundColor: C.surface }}>
        © 2025 About Time · AI-powered scheduling
      </footer>

    </div>
  );
}
