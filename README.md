
# 🎓 PreppySphere: The AI-First Student Ecosystem

PreppySphere is an all-in-one academic companion designed to bridge the gap between student life, administrative tasks, and mental well-being. Powered by **Google Gemini AI**, it provides a streamlined, jargon-free experience for modern scholars.

---

## 🚀 Key Features

### 📚 AI Study Planner
Stop guessing how to study. Enter your subject and available time, and PreppySphere generates a milestone-based schedule.
- **Milestone Tracking**: Break large subjects into bite-sized tasks.
- **Retention Tips**: Expert AI advice on how to remember what you learn.

### 🧠 AI Tutor (Doubt Assistant)
Stuck on a concept at 2 AM? Our AI Tutor explains complex topics in plain English.
- **Zero Jargon**: Explanations are filtered to be simple and concise.
- **Symbol-Free**: No complex formulas or scary notation—just understanding.

### 🌿 Wellness Center
Academic success shouldn't come at the cost of your health.
- **Stress Buster**: A rapid 3-point check-in to gauge your current state.
- **Personalized Tips**: AI-generated advice across mental, physical, and social domains.

### 📍 Smart Issue Tracker
Improve your campus with AI-powered reporting.
- **AI Routing**: Automatically categorizes issues (Infrastructure, Safety, Academic) and identifies the correct department to handle them.
- **Real-time Status**: Track the progress of your reports from "Pending" to "Resolved."

### 📋 Task & Formality Manager
Never miss a university deadline.
- **Daily Goals**: Track your personal study targets.
- **Campus Formalities**: Manage "official" tasks like ID verification or library returns with dedicated deadline tracking.

---

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS (Mobile-First / Android Design Language)
- **AI Engine**: Google Gemini API (`gemini-3-flash-preview`)
- **Icons**: Lucide React
- **Build Tool**: Vite

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/preppysphere.git
cd preppysphere
```

### 3. Configure API Key
The app requires a Google Gemini API Key. 
- Get your key from [Google AI Studio](https://aistudio.google.com/).
- In a production environment, set your environment variable:
  ```bash
  export API_KEY=your_key_here
  ```
- *Note: The app includes a built-in Key Selector UI for easy setup during development.*

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 📱 Design Philosophy
PreppySphere follows a **Glassmorphic Android** design language:
- **Soft UI**: Rounded corners (`3rem`) and subtle indigo shadows.
- **Legibility First**: High line-heights and clear typography for "tired eyes" study sessions.
- **Haptic Feel**: Interactive buttons with scale-transformations on click.

---

## 🔒 Security & Privacy
- **Campus Verification**: Authentication logic is built to support university-specific email domains.
- **Local Persistence**: User profiles and task data are stored securely in `localStorage` for offline-first speed.
- **AI Safety**: System instructions ensure the AI remains a helpful tutor and wellness advocate, strictly avoiding harmful or non-academic content.

---

## 🗺 Roadmap
- [ ] **Native Audio**: Live voice interaction for the Doubt Assistant.
- [ ] **Document Analysis**: Uploading syllabus PDFs for auto-generation of plans.
- [ ] **Club Integration**: Direct API links to campus student union portals.

---

