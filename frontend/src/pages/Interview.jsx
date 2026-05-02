import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const API = 'http://localhost:5000';

function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const socketRef = useRef(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    socketRef.current = io(API);
    socketRef.current.emit('join-interview', { interviewId });

    socketRef.current.on('ai-response', (data) => {
      setMessages(prev => [...prev, { role: 'ai', text: data.message, time: new Date() }]);
      speakText(data.message);
    });

    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessages(prev => [...prev, { role: 'user', text: transcript, time: new Date() }]);
        socketRef.current.emit('user-message', { interviewId, message: transcript });
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        setIsRecording(false);
        if (event.error !== 'no-speech') alert('Speech recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }

    return () => {
      socketRef.current?.disconnect();
      window.speechSynthesis?.cancel();
    };
  }, [interviewId]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) return alert('Speech recognition only works in Chrome');
    setIsRecording(true);
    try { recognitionRef.current.start(); } catch { setIsRecording(false); }
  };

  const handleStopInterview = () => {
    setShowConfirm(true);
  };

  const confirmEnd = async () => {
    setShowConfirm(false);
    try {
      await axios.post(`${API}/api/interview/stop/${interviewId}`);
      window.speechSynthesis?.cancel();
      navigate('/history');
    } catch {
      alert('Error stopping interview');
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.page}>

      {/* ── Confirm End Modal ── */}
      {showConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}>⏹</div>
            <h2 style={styles.modalTitle}>End Interview?</h2>
            <p style={styles.modalDesc}>
              Your session will be saved and you can view the report from your history.
            </p>
            <div style={styles.modalBtns}>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setShowConfirm(false)}
              >
                Keep Going
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none' }}
                onClick={confirmEnd}
              >
                Yes, End It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar / Interviewer Panel */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <div style={styles.logoMark}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#gs)" />
              <defs>
                <linearGradient id="gs" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="22" r="2" fill="white"/>
            </svg>
            <span style={styles.logoText}>InterviewAI</span>
          </div>

          <div style={styles.interviewerAvatar}>
            <div style={styles.avatarRing}>
              <div style={{...styles.avatarPulse, ...(isSpeaking ? styles.avatarPulseActive : {})}} />
              <div style={styles.avatarImg}>
                <span style={{ fontSize: 36 }}>🤖</span>
              </div>
            </div>
            <div style={styles.interviewerInfo}>
              <div style={styles.interviewerName}>AI Interviewer</div>
              <div style={styles.interviewerStatus}>
                <div style={{...styles.statusDot, background: isSpeaking ? '#10b981' : '#6366f1'}} />
                {isSpeaking ? 'Speaking...' : 'Listening'}
              </div>
            </div>
          </div>

          <div style={styles.sidebarDivider} />

          <div style={styles.sessionInfo}>
            <div style={styles.sessionLabel}>SESSION ACTIVE</div>
            <div style={styles.sessionId}>{interviewId.slice(-8).toUpperCase()}</div>
          </div>

          <div style={styles.sidebarStats}>
            <div style={styles.sidebarStat}>
              <div style={styles.sidebarStatVal}>{messages.filter(m => m.role === 'ai').length}</div>
              <div style={styles.sidebarStatLabel}>Questions</div>
            </div>
            <div style={styles.sidebarStat}>
              <div style={styles.sidebarStatVal}>{messages.filter(m => m.role === 'user').length}</div>
              <div style={styles.sidebarStatLabel}>Answers</div>
            </div>
          </div>
        </div>

        <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleStopInterview}>
          ⏹ End Interview
        </button>
      </div>

      {/* Chat area */}
      <div style={styles.chatArea}>
        {/* Chat header */}
        <div style={styles.chatHeader}>
          <div>
            <h1 style={styles.chatTitle}>Interview in Progress</h1>
            <p style={styles.chatSubtitle}>Speak clearly into your microphone • Chrome recommended</p>
          </div>
          <div style={styles.liveChip}>
            <div style={styles.liveDot} />
            LIVE
          </div>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎤</div>
              <div style={styles.emptyTitle}>Connecting to AI Interviewer...</div>
              <div style={styles.emptyDesc}>Your first question will appear here momentarily</div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} style={{
              ...styles.messageRow,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              animation: `fadeInUp 0.3s ease both`,
            }}>
              <div style={{
                ...styles.msgAvatar,
                background: msg.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.08)',
              }}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div style={{
                ...styles.bubble,
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : 'rgba(255,255,255,0.06)',
                borderColor: msg.role === 'user' ? 'transparent' : 'rgba(255,255,255,0.08)',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={styles.bubbleSender}>
                  {msg.role === 'user' ? 'You' : 'AI Interviewer'}
                </div>
                <div style={styles.bubbleText}>{msg.text}</div>
                <div style={styles.bubbleTime}>{formatTime(msg.time)}</div>
              </div>
            </div>
          ))}

          {isRecording && (
            <div style={styles.recordingIndicator}>
              <div style={styles.recordingDot} />
              <div style={styles.recordingDot2} />
              <div style={styles.recordingDot3} />
              <span style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>Recording your answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.controlsInner}>
            <div style={styles.hintText}>
              {isRecording ? '🔴 Listening... speak your answer now' : '💬 Press the button to answer the current question'}
            </div>
            <button
              style={{
                ...styles.recordBtn,
                background: isRecording
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: isRecording
                  ? '0 0 30px rgba(239,68,68,0.4), 0 8px 25px rgba(239,68,68,0.3)'
                  : '0 0 30px rgba(99,102,241,0.35), 0 8px 25px rgba(99,102,241,0.25)',
              }}
              onClick={startRecording}
              disabled={isRecording}
            >
              {isRecording ? (
                <>
                  <div style={styles.recordingRing} />
                  <span style={{ fontSize: 24 }}>⏸</span>
                </>
              ) : (
                <span style={{ fontSize: 28 }}>🎤</span>
              )}
            </button>
            <div style={styles.controlHint}>
              {isRecording ? 'Recording...' : 'Click to speak'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { height: '100vh', background: '#0a0a0f', display: 'flex', overflow: 'hidden' },

  sidebar: {
    width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: 24, background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.07)',
  },
  sidebarTop: { display: 'flex', flexDirection: 'column', gap: 24 },
  logoMark: { display: 'flex', alignItems: 'center', gap: 8 },
  logoText: { fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' },

  interviewerAvatar: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  avatarRing: { position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatarPulse: {
    position: 'absolute', inset: -4, borderRadius: '50%',
    border: '2px solid rgba(99,102,241,0.3)', transition: 'all 0.3s',
  },
  avatarPulseActive: {
    border: '2px solid rgba(16,185,129,0.6)',
    boxShadow: '0 0 20px rgba(16,185,129,0.3)',
    animation: 'pulse-ring 1.5s ease-out infinite',
  },
  avatarImg: {
    width: 90, height: 90, borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
    border: '2px solid rgba(99,102,241,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  interviewerInfo: { textAlign: 'center' },
  interviewerName: { fontSize: 15, fontWeight: 700, color: '#f1f5f9' },
  interviewerStatus: { display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: '50%', transition: 'background 0.3s' },

  sidebarDivider: { height: 1, background: 'rgba(255,255,255,0.07)' },

  sessionInfo: { textAlign: 'center' },
  sessionLabel: { fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 },
  sessionId: { fontSize: 16, fontWeight: 800, color: '#6366f1', fontFamily: 'monospace', letterSpacing: '0.05em' },

  sidebarStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  sidebarStat: {
    textAlign: 'center', padding: '14px 8px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
  },
  sidebarStatVal: { fontSize: 24, fontWeight: 800, color: '#818cf8', lineHeight: 1 },
  sidebarStatLabel: { fontSize: 11, color: '#64748b', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },

  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },

  chatHeader: {
    padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.02)',
  },
  chatTitle: { fontSize: 20, fontWeight: 800, color: '#f1f5f9' },
  chatSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  liveChip: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 999, color: '#f87171', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
  },
  liveDot: { width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' },

  messages: {
    flex: 1, overflowY: 'auto', padding: '24px 28px',
    display: 'flex', flexDirection: 'column', gap: 20,
  },

  emptyState: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: 60, gap: 12, marginTop: 60,
  },
  emptyIcon: { fontSize: 48, marginBottom: 8, animation: 'float 3s ease-in-out infinite' },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: '#94a3b8' },
  emptyDesc: { fontSize: 14, color: '#475569', textAlign: 'center' },

  messageRow: { display: 'flex', gap: 12, alignItems: 'flex-end' },
  msgAvatar: {
    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  bubble: {
    maxWidth: '72%', padding: '14px 18px', borderRadius: 16,
    border: '1px solid', display: 'flex', flexDirection: 'column', gap: 6,
  },
  bubbleSender: { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  bubbleText: { fontSize: 15, color: '#e2e8f0', lineHeight: 1.65 },
  bubbleTime: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 },

  recordingIndicator: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8,
    alignSelf: 'center',
  },
  recordingDot: { width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 0.6s ease-in-out infinite' },
  recordingDot2: { width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 0.6s 0.2s ease-in-out infinite' },
  recordingDot3: { width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 0.6s 0.4s ease-in-out infinite' },

  controls: {
    padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.02)',
  },
  controlsInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  hintText: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  recordBtn: {
    position: 'relative', width: 80, height: 80, borderRadius: '50%', border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s', outline: 'none',
  },
  recordingRing: {
    position: 'absolute', inset: -6, borderRadius: '50%',
    border: '2px solid rgba(239,68,68,0.5)', animation: 'pulse-ring 1.2s ease-out infinite',
  },
  controlHint: { fontSize: 12, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' },

  /* ── Modal ── */
  modalOverlay: {
    position: 'fixed', inset: 0, zIndex: 999,
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: '#15151f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, padding: '36px 40px', maxWidth: 400, width: '90%',
    textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
    animation: 'fadeInUp 0.25s ease both',
  },
  modalIcon: {
    fontSize: 40, marginBottom: 16, lineHeight: 1,
  },
  modalTitle: {
    fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 28,
  },
  modalBtns: {
    display: 'flex', gap: 12,
  },
};

export default Interview;