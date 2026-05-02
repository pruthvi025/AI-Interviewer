<div align="center">

<img src="https://img.shields.io/badge/InterviewAI-6366f1?style=for-the-badge&logo=artificial-intelligence&logoColor=white" alt="InterviewAI" />

# InterviewAI — AI-Powered Interview Practice Tool

**Practice real job interviews with a voice-based AI interviewer. Get instant feedback, performance reports, and track your progress.**

[![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash-4285f4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🖥️ Preview

> Dark, premium UI with split-panel login, interactive dashboard, live interview chat, and AI-generated performance reports.

| Login | Dashboard | Interview | Report |
|-------|-----------|-----------|--------|
| Split-panel hero with feature list | Role selector + difficulty chips | Live voice chat with sidebar | Score circle + progress bars |

---

## ✨ Features

- 🎤 **Voice-Based Interviews** — Speak your answers using your microphone; the AI listens and responds
- 🤖 **Gemini 2.5 Flash AI** — Context-aware questions tailored to your role, experience & difficulty
- ⚡ **Real-Time Communication** — Powered by Socket.IO for zero-latency AI responses
- 📊 **Performance Reports** — AI-generated report with overall score, skill breakdown, strengths & recommendations
- 📋 **Interview History** — View all past sessions with status, exchanges, and generate reports anytime
- 🔐 **User Authentication** — Signup / Login system with session persistence
- 🎨 **Premium Dark UI** — Professional glassmorphism design with Inter font, gradient accents, micro-animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18.2 + Vite 5 | UI framework & build tool |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP requests to backend |
| Socket.IO Client | Real-time interview communication |
| Web Speech API | Voice recognition (Chrome) |
| Inter (Google Fonts) | Premium typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Socket.IO | WebSocket server |
| MongoDB + Mongoose | Database & ODM |
| Google Generative AI | Gemini 2.5 Flash model |
| dotenv | Environment variable management |
| nodemon | Dev server auto-restart |

---

## 📁 Project Structure

```
AI-Interviewer/
├── backend/
│   ├── models/
│   │   ├── User.js              # User Mongoose schema
│   │   └── Interview.js         # Interview + chat transcript schema
│   ├── server.js                # Express + Socket.IO server
│   ├── package.json
│   └── .env                     # ⚠️ Create this yourself (see setup)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Split-panel login
│   │   │   ├── Signup.jsx       # Signup with onboarding panel
│   │   │   ├── Dashboard.jsx    # Interview configuration
│   │   │   ├── Interview.jsx    # Live voice interview
│   │   │   ├── InterviewHistory.jsx  # Past sessions list
│   │   │   └── Report.jsx       # AI performance report
│   │   ├── App.jsx              # Routes
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global dark design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── QUICKSTART.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Check |
|---|---|---|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| Google Chrome | Latest | For voice recognition |
| Gemini API Key | Free | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| MongoDB Atlas | Free M0 | [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/pruthvi025/AI-Interviewer.git
cd AI-Interviewer
```

---

### Step 2 — Get Your Gemini API Key

1. Go to → **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — it looks like `AIzaSyD_xxxxxxxxxxxxxxxxxxxxxxxx`

---

### Step 3 — Set Up MongoDB Atlas (Free)

1. Sign up at → **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**
2. Create a free **M0 cluster**
3. Create a **Database User** (save the username & password)
4. Under **Network Access** → Add IP → Allow from anywhere (`0.0.0.0/0`)
5. Go to **Connect → Drivers** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai-interview?retryWrites=true&w=majority
   ```
   > ⚠️ If your password contains `@`, replace it with `%40` (URL encoding)

---

### Step 4 — Configure Backend Environment

Create a file `backend/.env` (this file is NOT included in the repo for security):

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-interview?retryWrites=true&w=majority&appName=Cluster0
GEMINI_API_KEY=AIzaSyD_your_actual_key_here
```

---

### Step 5 — Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (open a new terminal)
cd frontend
npm install
```

---

### Step 6 — Run the Application

**Terminal 1 — Start Backend:**
```bash
cd backend
npm run dev
```
✅ You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

**Terminal 2 — Start Frontend:**
```bash
cd frontend
npm run dev
```
✅ You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

### Step 7 — Open the App

Open **Google Chrome** and go to: **http://localhost:5173/**

---

## 🎯 How to Use

```
1. Sign Up   → Create your account
2. Login     → Sign in with your credentials
3. Configure → Set Position, Experience Level & Difficulty
4. Start     → Click "Start Interview" — allow microphone when prompted
5. Speak     → Click 🎤 and answer the AI's question
6. End       → Click "⏹ End Interview" when done
7. Report    → Go to History → "View Report" for your AI performance analysis
```

---

## 🔌 API Reference

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/signup` | Register new user |
| `POST` | `/api/login` | Authenticate user |
| `GET`  | `/api/user/:userId` | Get user profile |
| `POST` | `/api/interview/start` | Start new interview session |
| `POST` | `/api/interview/stop/:id` | End interview session |
| `GET`  | `/api/interviews/user/:userId` | Get all user interviews |
| `POST` | `/api/interview/report/:id` | Generate AI performance report |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-interview` | Client → Server | Join interview room |
| `user-message` | Client → Server | Send spoken answer |
| `ai-response` | Server → Client | Receive AI question |
| `error` | Server → Client | Error notification |

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  firstName: String,   // required
  lastName:  String,   // required
  email:     String,   // required, unique
  password:  String,   // required (plain text — demo only)
  createdAt: Date,
  updatedAt: Date
}
```

### Interview Collection
```javascript
{
  userId:    ObjectId,           // ref: User
  position:  String,
  experience: String,
  difficulty: String,
  isStart:   Boolean,            // true = active, false = completed
  chatTranscript: [{
    role:      String,           // 'user' | 'ai'
    message:   String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB connection error` | Check Atlas IP whitelist — add `0.0.0.0/0`. Verify password `@` → `%40` |
| `GEMINI_API_KEY invalid` | Ensure no quotes or spaces around the key in `.env` |
| Voice not working | Must use **Google Chrome** — Web Speech API is Chrome-only |
| Port 5000 in use | Change `PORT=5000` to `PORT=5001` in `.env`, also update `API` constant in all frontend pages |
| End Interview not working | The app uses an in-app modal — browser must not block scripts |
| `Cannot find module` | Run `npm install` in both `backend/` and `frontend/` directories |

---

## 🔐 Security Notice

> ⚠️ This is a **learning/demo project**. For production use, you should:
> - Hash passwords with **bcrypt**
> - Add **JWT** authentication & token refresh
> - Implement **rate limiting** on API routes
> - Add **input validation** (e.g., with Joi or Zod)
> - Use **HTTPS** in production
> - Move secrets to a secret manager (not just `.env`)

---

## 🌟 Roadmap

- [ ] bcrypt password hashing
- [ ] JWT authentication
- [ ] Resume upload & AI analysis
- [ ] Interview scoring trends / analytics charts
- [ ] Multiple interview types (behavioral, technical, HR)
- [ ] Email notifications & reminders
- [ ] Dark/Light mode toggle
- [ ] Mobile-responsive layout

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for learning and personal projects.

---

<div align="center">

**Built with ❤️ by [Pruthviraj Thorbole](https://github.com/pruthvi025)**

*Happy Interviewing! 🎤*

</div>
