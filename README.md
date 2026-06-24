# Ansh Gangwar — AI Portfolio

An AI-powered portfolio where visitors chat with a Gemini-powered assistant that knows your entire resume. Built with React + Vite + Tailwind CSS + Vercel serverless functions.

---

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Get a Gemini API key
Go to [aistudio.google.com](https://aistudio.google.com), create a project, and generate an API key.

### 3. Add the key locally
```bash
cp .env.example .env.local
```
Open `.env.local` and paste your key:
```
GEMINI_API_KEY=your_actual_key_here
```

### 4. Run
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173)

---

## Deploy to Vercel

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. In **Settings → Environment Variables**, add:
   ```
   GEMINI_API_KEY = your_actual_key_here
   ```
4. Click **Deploy** — done.

---

## Updating your data

All portfolio content lives in **`src/data/resume.js`**:
- Update `profile.github` and `profile.linkedin` with your real URLs
- Update `project.live` and `project.github` for each project

The AI system prompt (what Gemini "knows" about you) lives in **`api/chat.js`** — update the `SYSTEM_PROMPT` constant whenever your experience or projects change.

---

## Model

Using `gemini-2.5-flash-lite` — the most generous free tier as of mid-2026 (1,000 requests/day, 15 RPM).

Check [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) for the latest model IDs if you hit errors.

---

## Project Structure

```
ansh-portfolio/
├── api/
│   └── chat.js              ← Vercel serverless fn — only file that touches the API key
├── src/
│   ├── data/
│   │   └── resume.js        ← single source of truth for all portfolio data
│   ├── hooks/
│   │   └── useChat.js       ← chat state, session limit, API calls
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatWindow.jsx
│   │   │   └── MessageBubble.jsx
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx
│   │   └── UI/
│   │       ├── ProjectCard.jsx
│   │       └── SkillBadge.jsx
│   ├── pages/
│   │   ├── Home.jsx         ← chat (hero page)
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .env.local               ← your API key (never committed)
├── vercel.json
└── package.json
```
