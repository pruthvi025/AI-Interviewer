import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000';

const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @media print { .no-print { display:none !important; } }
`;
document.head.appendChild(styleSheet);

function ScoreCircle({ score, size = 120, stroke = 12 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize: size > 100 ? 28 : 20, fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>/ 100</span>
      </div>
    </div>
  );
}

function ProgressBar({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 4, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  );
}

function Report() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { generateReport(); }, [interviewId]);

  const generateReport = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API}/api/interview/report/${interviewId}`);
      setReport(response.data.report);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPerfColor = (level) => {
    const m = { Excellent: '#10b981', Good: '#6366f1', Average: '#f59e0b', 'Needs Improvement': '#ef4444' };
    return m[level] || '#64748b';
  };

  const getPerfBg = (level) => {
    const m = { Excellent: 'rgba(16,185,129,0.12)', Good: 'rgba(99,102,241,0.12)', Average: 'rgba(245,158,11,0.12)', 'Needs Improvement': 'rgba(239,68,68,0.12)' };
    return m[level] || 'rgba(100,116,139,0.12)';
  };

  if (loading) return (
    <div style={styles.fullCenter}>
      <div style={styles.loadingCard}>
        <div style={{ animation: 'float 2s ease-in-out infinite', fontSize: 48, marginBottom: 16 }}>🤖</div>
        <div className="spinner" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Generating Your Report</h2>
        <p style={{ color: '#64748b', fontSize: 14 }}>AI is analyzing your interview performance...</p>
      </div>
    </div>
  );

  if (error || !report) return (
    <div style={styles.fullCenter}>
      <div style={styles.loadingCard}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>{error || 'No Report Available'}</h2>
        <button className="btn btn-primary" onClick={() => navigate('/history')}>← Back to History</button>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Nav */}
      <nav style={styles.nav} className="no-print">
        <div style={styles.navInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#gr)" />
              <defs>
                <linearGradient id="gr" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="22" r="2" fill="white"/>
            </svg>
            <span style={styles.logoText}>InterviewAI</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => navigate('/history')}>← History</button>
            <button className="btn btn-ghost" onClick={() => window.print()}>🖨 Print</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>New Interview →</button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Page header */}
        <div style={styles.pageHero}>
          <div>
            <div style={styles.heroEyebrow}>📊 Performance Report</div>
            <h1 style={styles.heroTitle}>{report.position}</h1>
            <div style={styles.heroMeta}>
              <span style={styles.metaChip}>{report.experience}</span>
              <span style={styles.metaChip}>{report.difficulty}</span>
              <span style={styles.metaDate}>
                {new Date(report.interviewDate).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
              </span>
            </div>
          </div>
          <div style={{ ...styles.perfBadge, background: getPerfBg(report.performanceLevel), border: `1px solid ${getPerfColor(report.performanceLevel)}30` }}>
            <span style={{ fontSize: 28 }}>
              {report.performanceLevel === 'Excellent' ? '🏆' : report.performanceLevel === 'Good' ? '👍' : report.performanceLevel === 'Average' ? '📈' : '💪'}
            </span>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Performance</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: getPerfColor(report.performanceLevel) }}>{report.performanceLevel}</div>
            </div>
          </div>
        </div>

        {/* Top row: overall + breakdown */}
        <div style={styles.topRow}>
          {/* Overall score */}
          <div style={styles.overallCard}>
            <h2 style={styles.cardTitle}>Overall Score</h2>
            <div style={styles.overallScore}>
              <ScoreCircle score={report.overallScore} size={160} stroke={16} />
              <div style={styles.overallMeta}>
                <div style={styles.overallLabel}>Your overall performance</div>
                <div style={styles.overallDesc}>Based on technical skills, communication, confidence, and problem solving</div>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div style={styles.breakdownCard}>
            <h2 style={styles.cardTitle}>Score Breakdown</h2>
            <div style={styles.breakdownList}>
              {[
                { label: 'Technical Skills', score: report.technicalScore, icon: '💻' },
                { label: 'Communication', score: report.communicationScore, icon: '🗣️' },
                { label: 'Confidence', score: report.confidenceScore, icon: '💪' },
                { label: 'Problem Solving', score: report.problemSolvingScore, icon: '🧠' },
              ].map((item, i) => (
                <div key={i} style={styles.breakdownItem}>
                  <div style={styles.breakdownHeader}>
                    <div style={styles.breakdownLabel}>
                      <span>{item.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{item.label}</span>
                    </div>
                    <span style={{
                      fontSize: 16, fontWeight: 800,
                      color: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#ef4444'
                    }}>{item.score}%</span>
                  </div>
                  <ProgressBar score={item.score} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { icon: '❓', val: report.questionsAsked, label: 'Questions Asked' },
            { icon: '💬', val: report.answersGiven, label: 'Answers Given' },
            { icon: '📏', val: report.averageResponseLength, label: 'Avg Response' },
            { icon: '⏱️', val: report.interviewDuration, label: 'Duration' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statVal}>{s.val}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Strengths + Weaknesses */}
        <div style={styles.swRow}>
          <div style={styles.swCard}>
            <h2 style={{ ...styles.cardTitle, color: '#34d399' }}>💪 Strengths</h2>
            <ul style={styles.swList}>
              {report.strengths.map((s, i) => (
                <li key={i} style={styles.swItem}>
                  <div style={{ ...styles.swDot, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <span style={{ color: '#34d399', fontSize: 10, fontWeight: 800 }}>✓</span>
                  </div>
                  <span style={styles.swText}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.swCard}>
            <h2 style={{ ...styles.cardTitle, color: '#fbbf24' }}>📈 Areas to Improve</h2>
            <ul style={styles.swList}>
              {report.weaknesses.map((w, i) => (
                <li key={i} style={styles.swItem}>
                  <div style={{ ...styles.swDot, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <span style={{ color: '#fbbf24', fontSize: 12, fontWeight: 800 }}>!</span>
                  </div>
                  <span style={styles.swText}>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed feedback */}
        <div style={styles.feedbackCard}>
          <h2 style={styles.cardTitle}>📝 Detailed Feedback</h2>
          <p style={styles.feedbackText}>{report.detailedFeedback}</p>
        </div>

        {/* Recommendations */}
        <div style={styles.recsCard}>
          <h2 style={styles.cardTitle}>🎯 Recommendations</h2>
          <div style={styles.recsList}>
            {report.recommendations.map((r, i) => (
              <div key={i} style={styles.recItem}>
                <div style={styles.recNum}>{i + 1}</div>
                <div style={styles.recText}>{r}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', position: 'relative', overflow: 'hidden' },
  orb1: { position:'fixed', top:'-10%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 },
  orb2: { position:'fixed', bottom:'-15%', left:'-10%', width:450, height:450, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 },

  fullCenter: { height:'100vh', background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center' },
  loadingCard: {
    display:'flex', flexDirection:'column', alignItems:'center', gap:8,
    padding:'48px 56px', background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, textAlign:'center',
  },

  nav: { position:'sticky', top:0, zIndex:100, background:'rgba(10,10,15,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)' },
  navInner: { maxWidth:1100, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' },
  logoText: { fontSize:16, fontWeight:800, color:'#f1f5f9', letterSpacing:'-0.02em' },

  main: { maxWidth:1100, margin:'0 auto', padding:'40px 24px 60px', position:'relative', zIndex:1 },

  pageHero: {
    display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20,
    padding:'32px 36px', marginBottom:28,
    background:'linear-gradient(135deg,rgba(99,102,241,0.08) 0%,rgba(139,92,246,0.05) 100%)',
    border:'1px solid rgba(99,102,241,0.15)', borderRadius:20,
  },
  heroEyebrow: { fontSize:13, fontWeight:600, color:'#6366f1', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 },
  heroTitle: { fontSize:32, fontWeight:900, color:'#f1f5f9', letterSpacing:'-0.02em', marginBottom:12 },
  heroMeta: { display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' },
  metaChip: { padding:'4px 12px', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:6, fontSize:12, fontWeight:600, color:'#818cf8' },
  metaDate: { fontSize:13, color:'#475569' },
  perfBadge: { display:'flex', alignItems:'center', gap:14, padding:'16px 24px', borderRadius:16 },

  topRow: { display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:20, marginBottom:20 },

  overallCard: { padding:28, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20 },
  overallScore: { display:'flex', alignItems:'center', gap:24, marginTop:20 },
  overallMeta: {},
  overallLabel: { fontSize:16, fontWeight:700, color:'#f1f5f9', marginBottom:8 },
  overallDesc: { fontSize:13, color:'#64748b', lineHeight:1.5, maxWidth:200 },

  breakdownCard: { padding:28, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20 },
  breakdownList: { display:'flex', flexDirection:'column', gap:20, marginTop:20 },
  breakdownItem: { display:'flex', flexDirection:'column', gap:8 },
  breakdownHeader: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  breakdownLabel: { display:'flex', alignItems:'center', gap:8 },

  cardTitle: { fontSize:17, fontWeight:800, color:'#f1f5f9', marginBottom:4 },

  statsRow: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 },
  statCard: { padding:'20px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, textAlign:'center' },
  statIcon: { fontSize:24, marginBottom:8 },
  statVal: { fontSize:22, fontWeight:800, color:'#818cf8', marginBottom:4 },
  statLabel: { fontSize:11, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 },

  swRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 },
  swCard: { padding:28, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20 },
  swList: { listStyle:'none', padding:0, marginTop:20, display:'flex', flexDirection:'column', gap:12 },
  swItem: { display:'flex', alignItems:'flex-start', gap:12 },
  swDot: { width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 },
  swText: { fontSize:14, color:'#94a3b8', lineHeight:1.6 },

  feedbackCard: { padding:28, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, marginBottom:20 },
  feedbackText: { fontSize:15, color:'#94a3b8', lineHeight:1.8, marginTop:16 },

  recsCard: { padding:28, background:'linear-gradient(135deg,rgba(99,102,241,0.07) 0%,rgba(139,92,246,0.04) 100%)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:20 },
  recsList: { display:'flex', flexDirection:'column', gap:12, marginTop:20 },
  recItem: { display:'flex', alignItems:'flex-start', gap:14, padding:'14px 18px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 },
  recNum: { width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff', flexShrink:0 },
  recText: { fontSize:14, color:'#94a3b8', lineHeight:1.6, flex:1, paddingTop:4 },
};

export default Report;