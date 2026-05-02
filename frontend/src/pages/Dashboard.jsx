import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [interviewData, setInterviewData] = useState({ position: '', experience: '', difficulty: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) { navigate('/'); return; }
    setUser(userData);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInterviewData({ ...interviewData, [name]: value });
  };

  const handleStartInterview = async () => {
    if (!interviewData.position || !interviewData.experience || !interviewData.difficulty) {
      alert('Please fill in all fields before starting the interview');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/interview/start`, {
        userId: user.id, ...interviewData
      });
      navigate(`/interview/${response.data.interviewId}`);
    } catch {
      alert('Error starting interview');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Analyst', 'Product Manager', 'DevOps Engineer', 'ML Engineer', 'Full Stack Developer'];

  return (
    <div style={styles.page}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logoMark}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#gd)" />
              <defs>
                <linearGradient id="gd" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="22" r="2" fill="white"/>
            </svg>
            <span style={styles.logoText}>InterviewAI</span>
          </div>

          <div style={styles.navActions}>
            <button className="btn btn-ghost" onClick={() => navigate('/history')}>
              📋 History
            </button>
            <div style={styles.userChip}>
              <div style={styles.userAvatar}>
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <span style={styles.userName}>{user.firstName} {user.lastName}</span>
            </div>
            <button className="btn btn-danger" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={styles.main}>
        {/* Welcome hero */}
        <div style={styles.hero}>
          <div style={styles.heroText}>
            <span style={styles.greeting}>Good day,</span>
            <h1 style={styles.heroTitle}>{user.firstName} {user.lastName} 👋</h1>
            <p style={styles.heroSubtitle}>Ready to practice? Configure your interview below and start when you're ready.</p>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.miniStat}>
              <div style={styles.miniStatIcon}>🎯</div>
              <div style={styles.miniStatText}>
                <div style={styles.miniStatVal}>AI-Powered</div>
                <div style={styles.miniStatLabel}>Questions</div>
              </div>
            </div>
            <div style={styles.miniStat}>
              <div style={styles.miniStatIcon}>🎤</div>
              <div style={styles.miniStatText}>
                <div style={styles.miniStatVal}>Voice</div>
                <div style={styles.miniStatLabel}>Interaction</div>
              </div>
            </div>
            <div style={styles.miniStat}>
              <div style={styles.miniStatIcon}>📊</div>
              <div style={styles.miniStatText}>
                <div style={styles.miniStatVal}>Instant</div>
                <div style={styles.miniStatLabel}>Reports</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards row */}
        <div style={styles.grid}>
          {/* Setup card */}
          <div style={styles.setupCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>⚙️</div>
              <div>
                <h2 style={styles.cardTitle}>Interview Setup</h2>
                <p style={styles.cardSubtitle}>Configure your interview session</p>
              </div>
            </div>

            <div className="divider" />

            <div className="form-group">
              <label className="form-label">Target Position</label>
              <input className="form-input" type="text" name="position"
                placeholder="e.g. Software Engineer, Data Analyst"
                value={interviewData.position} onChange={handleInputChange} />
              <div style={styles.chips}>
                {roles.map(r => (
                  <button key={r} style={{
                    ...styles.chip,
                    ...(interviewData.position === r ? styles.chipActive : {})
                  }} onClick={() => setInterviewData({ ...interviewData, position: r })}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <div style={styles.optionGrid}>
                {['Fresher', '1-2 years', '3-5 years', '5+ years'].map(exp => (
                  <button key={exp} style={{
                    ...styles.optionBtn,
                    ...(interviewData.experience === exp ? styles.optionBtnActive : {})
                  }} onClick={() => setInterviewData({ ...interviewData, experience: exp })}>
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <div style={styles.diffGrid}>
                {[
                  { val: 'Easy', icon: '🟢', desc: 'Basic concepts' },
                  { val: 'Medium', icon: '🟡', desc: 'Mixed questions' },
                  { val: 'Hard', icon: '🔴', desc: 'Expert level' },
                ].map(d => (
                  <button key={d.val} style={{
                    ...styles.diffBtn,
                    ...(interviewData.difficulty === d.val ? styles.diffBtnActive : {})
                  }} onClick={() => setInterviewData({ ...interviewData, difficulty: d.val })}>
                    <span style={{ fontSize: 20 }}>{d.icon}</span>
                    <span style={styles.diffLabel}>{d.val}</span>
                    <span style={styles.diffDesc}>{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-lg btn-full"
              onClick={handleStartInterview}
              disabled={loading || !interviewData.position || !interviewData.experience || !interviewData.difficulty}
              style={{ marginTop: 8 }}>
              {loading ? <><span style={styles.btnSpinner} /> Starting...</> : '🎤 Start Interview'}
            </button>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* How it works */}
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>How It Works</h3>
              <div style={styles.steps}>
                {[
                  { num: 1, title: 'Fill in your details', sub: 'Set position, experience & difficulty' },
                  { num: 2, title: 'Allow microphone access', sub: 'Chrome will prompt for permission' },
                  { num: 3, title: 'Click mic & speak', sub: 'Answer questions out loud' },
                  { num: 4, title: 'AI responds', sub: 'Next question comes automatically' },
                  { num: 5, title: 'End & get report', sub: 'View AI-generated performance report' },
                ].map(s => (
                  <div key={s.num} style={styles.step}>
                    <div style={styles.stepNum}>{s.num}</div>
                    <div>
                      <div style={styles.stepTitle}>{s.title}</div>
                      <div style={styles.stepSub}>{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips card */}
            <div style={styles.tipsCard}>
              <div style={styles.tipsHeader}>
                <span style={{ fontSize: 20 }}>💡</span>
                <span style={styles.tipsTitle}>Pro Tips</span>
              </div>
              <ul style={styles.tipsList}>
                {[
                  'Use Google Chrome for best voice recognition',
                  'Speak clearly and at a moderate pace',
                  'Take a moment to think before answering',
                  'Treat it like a real interview — stay professional',
                ].map((t, i) => (
                  <li key={i} style={styles.tipItem}>
                    <span style={styles.tipBullet}>→</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', position: 'relative', overflow: 'hidden' },
  orb1: {
    position: 'fixed', top: '-10%', right: '-10%', width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0,
  },
  orb2: {
    position: 'fixed', bottom: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0,
  },

  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navInner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logoMark: { display: 'flex', alignItems: 'center', gap: 10 },
  logoText: { fontSize: 18, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' },
  navActions: { display: 'flex', alignItems: 'center', gap: 12 },
  userChip: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '6px 12px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
  },
  userAvatar: {
    width: 28, height: 28, borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#cbd5e1' },

  main: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 },

  hero: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
    gap: 24, marginBottom: 36,
    padding: '32px 36px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
    border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20,
  },
  heroText: {},
  greeting: { fontSize: 14, color: '#6366f1', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },
  heroTitle: { fontSize: 36, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em', marginTop: 6 },
  heroSubtitle: { fontSize: 15, color: '#64748b', marginTop: 8, maxWidth: 440 },
  heroStats: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  miniStat: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 18px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12,
  },
  miniStatIcon: { fontSize: 24 },
  miniStatVal: { fontSize: 15, fontWeight: 700, color: '#f1f5f9' },
  miniStatLabel: { fontSize: 12, color: '#64748b' },

  grid: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' },

  setupCard: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: 32,
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 },
  cardIcon: { fontSize: 28, lineHeight: 1 },
  cardTitle: { fontSize: 20, fontWeight: 800, color: '#f1f5f9' },
  cardSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },

  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: {
    padding: '5px 12px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
    color: '#64748b', fontSize: 12, fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.15s',
  },
  chipActive: {
    background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)',
    color: '#818cf8',
  },

  optionGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  optionBtn: {
    padding: '10px 4px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
    color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.15s', textAlign: 'center',
  },
  optionBtnActive: {
    background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)', color: '#818cf8',
  },

  diffGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  diffBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '16px 8px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  diffBtnActive: {
    background: 'rgba(99,102,241,0.12)', borderColor: 'rgba(99,102,241,0.4)',
  },
  diffLabel: { fontSize: 13, fontWeight: 700, color: '#e2e8f0' },
  diffDesc: { fontSize: 11, color: '#64748b' },

  infoCard: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: 28,
  },
  infoTitle: { fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 },
  steps: { display: 'flex', flexDirection: 'column', gap: 16 },
  step: { display: 'flex', alignItems: 'flex-start', gap: 14 },
  stepNum: {
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 800, color: '#818cf8',
  },
  stepTitle: { fontSize: 14, fontWeight: 600, color: '#e2e8f0' },
  stepSub: { fontSize: 12, color: '#64748b', marginTop: 2 },

  tipsCard: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
    border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 24,
  },
  tipsHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  tipsTitle: { fontSize: 15, fontWeight: 700, color: '#f1f5f9' },
  tipsList: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  tipItem: { fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 },
  tipBullet: { color: '#6366f1', fontWeight: 700, flexShrink: 0 },

  btnSpinner: {
    display: 'inline-block', width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
};

export default Dashboard;