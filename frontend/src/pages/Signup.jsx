import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
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
      await axios.post(`${API}/api/signup`, formData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.wrapper}>
        {/* Left branding */}
        <div style={styles.leftPanel}>
          <div style={styles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#grad2)" />
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="32" y2="32">
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
            <h2 style={styles.heroTitle}>Start Your<br /><span style={styles.heroGradient}>Journey Today</span></h2>
            <p style={styles.heroDesc}>
              Create your free account and begin practicing interviews with our advanced AI system.
            </p>

            <div style={styles.steps}>
              {[
                { step: '01', title: 'Create Account', desc: 'Sign up in under 60 seconds' },
                { step: '02', title: 'Configure Interview', desc: 'Set your role, experience & difficulty' },
                { step: '03', title: 'Practice & Improve', desc: 'Get AI feedback and track progress' },
              ].map((s) => (
                <div key={s.step} style={styles.stepItem}>
                  <div style={styles.stepNum}>{s.step}</div>
                  <div>
                    <div style={styles.stepTitle}>{s.title}</div>
                    <div style={styles.stepDesc}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.leftNote}>
            <div style={styles.noteIcon}>🔒</div>
            <span style={styles.noteText}>Your data is private and secure. We never share your practice sessions.</span>
          </div>
        </div>

        {/* Right form */}
        <div style={styles.rightPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Create account</h2>
              <p style={styles.formSubtitle}>Join thousands of interview practitioners</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">First Name</label>
                  <input className="form-input" type="text" name="firstName" placeholder="John"
                    value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Last Name</label>
                  <input className="form-input" type="text" name="lastName" placeholder="Doe"
                    value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email address</label>
                <input className="form-input" type="email" name="email" placeholder="you@example.com"
                  value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" name="password" placeholder="Create a strong password"
                  value={formData.password} onChange={handleChange} required />
              </div>

              <p style={styles.terms}>
                By creating an account you agree to our{' '}
                <span style={styles.termsLink}>Terms of Service</span> and{' '}
                <span style={styles.termsLink}>Privacy Policy</span>
              </p>

              <button type="submit" className="btn btn-primary btn-lg btn-full"
                disabled={loading} style={{ marginTop: 8 }}>
                {loading ? (
                  <><span style={styles.btnSpinner} /> Creating account...</>
                ) : 'Create Free Account →'}
              </button>
            </form>

            <div style={styles.loginLink}>
              Already have an account?{' '}
              <Link to="/" style={styles.link}>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#0a0a0f',
    display: 'flex', alignItems: 'stretch', position: 'relative', overflow: 'hidden',
  },
  orb1: {
    position: 'absolute', top: '-15%', right: '-5%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: '-20%', left: '-10%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  wrapper: { display: 'flex', width: '100%', position: 'relative', zIndex: 1 },
  leftPanel: {
    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '48px 56px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 100%)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  logoMark: { display: 'flex', alignItems: 'center', gap: 12 },
  logoText: { fontSize: 20, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' },
  heroContent: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 40 },
  heroTitle: { fontSize: 44, fontWeight: 900, lineHeight: 1.1, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: 20 },
  heroGradient: {
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  heroDesc: { fontSize: 16, color: '#94a3b8', lineHeight: 1.7, marginBottom: 48, maxWidth: 380 },
  steps: { display: 'flex', flexDirection: 'column', gap: 28 },
  stepItem: { display: 'flex', alignItems: 'flex-start', gap: 16 },
  stepNum: {
    fontSize: 11, fontWeight: 800, color: '#6366f1', letterSpacing: '0.05em',
    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
    padding: '4px 8px', borderRadius: 6, flexShrink: 0, marginTop: 2,
  },
  stepTitle: { fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 },
  stepDesc: { fontSize: 13, color: '#64748b' },
  leftNote: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 18px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12,
  },
  noteIcon: { fontSize: 18 },
  noteText: { fontSize: 13, color: '#475569', lineHeight: 1.5 },
  rightPanel: { width: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 48px' },
  formCard: { width: '100%', maxWidth: 420 },
  formHeader: { marginBottom: 32 },
  formTitle: { fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 8 },
  formSubtitle: { fontSize: 15, color: '#64748b' },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 10, color: '#fca5a5', fontSize: 14, marginBottom: 20,
  },
  terms: { fontSize: 12, color: '#475569', marginBottom: 4, lineHeight: 1.6 },
  termsLink: { color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' },
  loginLink: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b' },
  link: { color: '#818cf8', textDecoration: 'none', fontWeight: 600 },
  btnSpinner: {
    display: 'inline-block', width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
};

export default Signup;
