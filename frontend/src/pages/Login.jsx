import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API}/api/login`, formData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.wrapper}>
        {/* Left panel */}
        <div style={styles.leftPanel}>
          <div style={styles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#grad)" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="22" r="2" fill="white" />
            </svg>
            <span style={styles.logoText}>InterviewAI</span>
          </div>

          <div style={styles.heroContent}>
            <div style={styles.badge}>
              <span style={styles.badgeDot} />
              AI-Powered Interview Practice
            </div>
            <h1 style={styles.heroTitle}>
              Ace Your Next<br />
              <span style={styles.heroGradient}>Interview</span>
            </h1>
            <p style={styles.heroDesc}>
              Practice with our AI interviewer, get real-time feedback, and track your improvement over time.
            </p>

            <div style={styles.featureList}>
              {['Voice-based interview sessions', 'Gemini AI-powered questions', 'Detailed performance reports', 'Track your progress history'].map((f, i) => (
                <div key={i} style={styles.featureItem}>
                  <div style={styles.featureCheck}>✓</div>
                  <span style={styles.featureText}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.leftFooter}>
            <div style={styles.avatarGroup}>
              {['#6366f1','#10b981','#f59e0b'].map((c,i) => (
                <div key={i} style={{...styles.avatar, background: c, marginLeft: i > 0 ? '-8px' : '0'}} />
              ))}
            </div>
            <span style={styles.leftFooterText}>Trusted by 1,000+ job seekers</span>
          </div>
        </div>

        {/* Right panel – form */}
        <div style={styles.rightPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome back</h2>
              <p style={styles.formSubtitle}>Sign in to continue your practice</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={loading}
                style={{ marginTop: 8 }}
              >
                {loading ? (
                  <><span style={styles.btnSpinner} /> Signing in...</>
                ) : 'Sign in →'}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerText}>New here?</span>
            </div>

            <Link to="/signup" className="btn btn-ghost btn-full" style={{ textDecoration: 'none', justifyContent: 'center' }}>
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'stretch',
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute', top: '-20%', left: '-10%',
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: '-20%', right: '-10%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  wrapper: {
    display: 'flex', width: '100%', position: 'relative', zIndex: 1,
  },
  leftPanel: {
    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '48px 56px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  logoMark: { display: 'flex', alignItems: 'center', gap: 12 },
  logoText: { fontSize: 20, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' },
  heroContent: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 48 },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
    padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
    color: '#818cf8', marginBottom: 24, width: 'fit-content',
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#6366f1',
    boxShadow: '0 0 6px #6366f1', animation: 'pulse 2s infinite',
  },
  heroTitle: { fontSize: 52, fontWeight: 900, lineHeight: 1.1, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: 20 },
  heroGradient: {
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #8b5cf6 100%)',
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroDesc: { fontSize: 17, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 400 },
  featureList: { display: 'flex', flexDirection: 'column', gap: 14 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 12 },
  featureCheck: {
    width: 22, height: 22, borderRadius: '50%',
    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#10b981', fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  featureText: { fontSize: 15, color: '#cbd5e1' },
  leftFooter: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarGroup: { display: 'flex', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: '50%', border: '2px solid #0a0a0f' },
  leftFooterText: { fontSize: 13, color: '#64748b' },

  rightPanel: {
    width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px',
  },
  formCard: { width: '100%', maxWidth: 400 },
  formHeader: { marginBottom: 32 },
  formTitle: { fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 8 },
  formSubtitle: { fontSize: 15, color: '#64748b' },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 10, color: '#fca5a5', fontSize: 14, marginBottom: 20,
  },
  errorIcon: {
    width: 20, height: 20, borderRadius: '50%',
    background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 700, flexShrink: 0, lineHeight: '20px', textAlign: 'center',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '24px 0', position: 'relative',
  },
  dividerText: {
    fontSize: 13, color: '#475569', padding: '0 12px',
    background: '#0a0a0f', position: 'relative', zIndex: 1,
    marginLeft: 'auto', marginRight: 'auto',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
  },
  btnSpinner: {
    display: 'inline-block', width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
};

export default Login;
