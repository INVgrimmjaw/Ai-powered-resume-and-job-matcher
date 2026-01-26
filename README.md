# AI-Powered Resume & Job Matcher

## 📌 Overview

The **AI-Powered Resume & Job Matcher** is a full-stack web application that analyzes a candidate’s resume against a job description and provides an intelligent match score, missing skills, and improvement suggestions using AI-driven semantic analysis.

This project is designed as a **portfolio-grade full-stack application**, demonstrating frontend development, backend APIs, file handling, AI integration, and secure configuration practices.

---

## 🎯 Motivation

Recruiters and ATS systems often filter resumes based on limited keyword matching. Many capable candidates fail to pass initial screenings despite being a strong fit.

This project aims to:
- Provide a realistic **resume–job compatibility score**
- Identify **missing or weak skills**
- Offer **actionable recommendations**
- Demonstrate real-world **AI API integration**

---

## ✨ Features

### Core Features
- Upload resume files (PDF, DOC, DOCX, TXT)
- Paste job descriptions
- AI-based resume analysis
- Resume–JD match score
- Skill extraction
- Missing skill detection
- Resume improvement suggestions

### Technical Features
- Secure file uploads
- Server-side text extraction
- AI prompt pipelines
- Scoring logic
- Graceful fallback when AI quota is unavailable
- Secure environment variable handling

---

## 🧠 How It Works

1. User uploads a resume file
2. User pastes a job description
3. Backend extracts raw text from the resume
4. Resume text and JD are processed using AI
5. Skills are extracted and compared
6. A match score is calculated
7. Results are returned to the frontend
8. UI displays score, skills, and suggestions

---

## 🏗️ Project Structure


---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- Multer
- pdf-parse
- mammoth
- OpenAI API

### Tooling
- Git & GitHub
- GitHub Desktop
- VS Code
- npm

---

## 🔐 Security Practices

- API keys stored in `.env`
- `.env` excluded using `.gitignore`
- GitHub secret scanning handled properly
- No secrets committed to the repository
- Clean Git history maintained

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-powered-resume-matcher.git
cd ai-powered-resume-matcher
