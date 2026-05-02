import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000';

function InterviewHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) { navigate('/'); return; }
    setUser(userData);
    fetchInterviews(userData.id);
  }, [navigate]);

  const fetchInterviews = async (userId) => {
    try {
      const response = await axios.get(`${API}/api/interviews/user/${userId}`);
      setInterviews(response.data.interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getDifficultyColor = (d) => {
    if (d === 'Easy') return { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', color: '#34d399' };
    if (d === 'Medium') return { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', color: '#fbbf24' };
    return { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', color: '#f87171' };
  };

  if (loading) return (
    <div style={{ height: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div className="spinner" />
      <p style={{ color: '#64748b', fontSize: 14 }}>Loading your interviews...</p>
    </div>
  );

  const total = interviews.length;
  const completed = interviews.filter(i => !i.isStart).length;
  const inProgress = interviews.filter(i => i.isStart).length;

  return (
    <div style={styles.page}>
      <div style={styles.orb1} />

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#gh)" />
              <defs>
                <linearGradient id="gh" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="22" r="2" fill="white"/>
            </svg>
            <span style={styles.logoText}>InterviewAI</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Interview History</h1>
            <p style={styles.pageSubtitle}>
              {user ? `${user.firstName}'s practice sessions` : 'Your practice sessions'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { val: total, label: 'Total Sessions', icon: '📋', color: '#818cf8' },
            { val: completed, label: 'Completed', icon: '✅', color: '#34d399' },
            { val: inProgress, label: 'In Progress', icon: '⏳', color: '#fbbf24' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statCardIcon}>{s.icon}</div>
              <div style={{ ...styles.statCardVal, color: s.color }}>{s.val}</div>
              <div style={styles.statCardLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* List */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>All Sessions</h2>

          {interviews.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎤</div>
              <h3 style={styles.emptyTitle}>No interviews yet</h3>
              <p style={styles.emptyDesc}>Head to the dashboard to start your first practice session</p>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Start First Interview →
              </button>
            </div>
          ) : (
            <div style={styles.list}>
              {interviews.map((interview) => {
                const dc = getDifficultyColor(interview.difficulty);
                return (
                  <div key={interview._id} style={styles.card}>
                    <div style={styles.cardLeft}>
                      <div style={styles.cardIconWrap}>
                        <span style={{ fontSize: 22 }}>💼</span>
                      </div>
                      <div style={styles.cardInfo}>
                        <h3 style={styles.cardPosition}>{interview.position}</h3>
                        <div style={styles.cardMeta}>
                          <span style={styles.metaTag}>{interview.experience}</span>
                          <span style={{ ...styles.metaTag, background: dc.bg, borderColor: dc.border, color: dc.color }}>
                            {interview.difficulty}
                          </span>
                          <span style={styles.metaDate}>🕐 {formatDate(interview.createdAt)}</span>
                        </div>
                        <div style={styles.cardExchanges}>
                          {interview.chatTranscript.length} message{interview.chatTranscript.length !== 1 ? 's' : ''} exchanged
                        </div>
                      </div>
                    </div>

                    <div style={styles.cardRight}>
                      <div style={{
                        ...styles.statusBadge,
                        background: interview.isStart ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                        border: `1px solid ${interview.isStart ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
                        color: interview.isStart ? '#fbbf24' : '#34d399',
                      }}>
                        {interview.isStart ? '⏳ In Progress' : '✅ Completed'}
                      </div>

                      {!interview.isStart && interview.chatTranscript.length > 0 && (
                        <button className="btn btn-primary"
                          style={{ padding: '10px 20px', fontSize: 13 }}
                          onClick={() => navigate(`/report/${interview._id}`)}>
                          View Report →
                        </button>
                      )}

                      {interview.isStart && (
                        <button className="btn btn-ghost"
                          style={{ padding: '10px 20px', fontSize: 13 }}
                          onClick={() => navigate(`/interview/${interview._id}`)}>
                          Continue →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', position: 'relative', overflow: 'hidden' },
  orb1: {
    position: 'fixed', top: '-15%', right: '-10%', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },

  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navInner: {
    maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logoText: { fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' },

  main: { maxWidth: 1100, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 },

  pageHeader: { marginBottom: 32 },
  pageTitle: { fontSize: 32, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' },
  pageSubtitle: { fontSize: 15, color: '#64748b', marginTop: 6 },

  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 },
  statCard: {
    padding: 24, background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, textAlign: 'center',
  },
  statCardIcon: { fontSize: 28, marginBottom: 10 },
  statCardVal: { fontSize: 40, fontWeight: 900, lineHeight: 1, marginBottom: 6 },
  statCardLabel: { fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' },

  section: {},
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 },

  list: { display: 'flex', flexDirection: 'column', gap: 12 },

  card: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
    padding: '20px 24px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16,
    transition: 'all 0.2s',
  },
  cardLeft: { display: 'flex', alignItems: 'center', gap: 16, flex: 1 },
  cardIconWrap: {
    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardPosition: { fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 },
  cardMeta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 },
  metaTag: {
    padding: '3px 10px', background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6,
    fontSize: 12, fontWeight: 600, color: '#818cf8',
  },
  metaDate: { fontSize: 12, color: '#475569' },
  cardExchanges: { fontSize: 13, color: '#64748b' },

  cardRight: { display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  statusBadge: { padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 },

  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '80px 20px', gap: 16,
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20,
  },
  emptyIcon: { fontSize: 56, marginBottom: 8, animation: 'float 3s ease-in-out infinite' },
  emptyTitle: { fontSize: 22, fontWeight: 800, color: '#94a3b8' },
  emptyDesc: { fontSize: 15, color: '#475569', textAlign: 'center', maxWidth: 360 },
};

export default InterviewHistory;