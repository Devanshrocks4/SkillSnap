# 🚀 SkillSnap – AI-Powered Recruitment Platform

<p align="center">
  <img src="./SkillSnap logo.png" alt="SkillSnap Logo" width="180"/>
</p>

<p align="center">
  <b>Modern AI-Powered Recruitment & Talent Intelligence Platform</b>
</p>

<p align="center">
  Built with React, TypeScript, Firebase, Firestore & AI-assisted Hiring Workflows
</p>

---


### AI-Powered Recruitment & Talent Management Platform

SkillSnap is a modern recruitment platform designed to simplify hiring workflows for candidates, recruiters, and administrators. The platform provides role-based authentication, job management, candidate management, application tracking, and AI-assisted recruitment workflows.

---

## 🌐 Live Demo

**Website:** https://skillsnapon.netlify.app

**Repository:** https://github.com/Devanshrocks4/SkillSnap

---

## 📌 Project Overview

SkillSnap was built to explore modern SaaS architecture using React, TypeScript, Firebase, and AI-assisted recruitment workflows.

The platform aims to provide:

* Candidate Management
* Recruiter Dashboard
* Job Posting System
* Application Tracking
* Role-Based Authentication
* Firebase Cloud Integration
* AI-Assisted Hiring Features

---

## ✨ Current Features

### Candidate Module

* User Registration & Login
* Candidate Dashboard
* Profile Management
* Skills & Experience Tracking
* Job Browsing
* Application Tracking

### Recruiter Module

* Recruiter Dashboard
* Job Creation
* Job Management
* Candidate Discovery
* Recruitment Analytics

### Authentication

* Firebase Authentication
* Email & Password Login
* Protected Routes
* Role-Based Access Control

### Database

* Cloud Firestore Integration
* User Profiles
* Jobs Collection
* Applications Collection

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Framer Motion

### Backend & Cloud

* Firebase Authentication
* Cloud Firestore
* Firebase Storage
* Netlify

### AI Integration

* Gemini AI Framework

---

## 🏗️ Architecture

```text
React + TypeScript
        │
        ▼
Firebase Authentication
        │
        ▼
Cloud Firestore
        │
        ▼
AI Service Layer
        │
        ▼
Netlify Deployment
```

---

## 📂 Database Structure

### Users

```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "role": "candidate | recruiter | admin"
}
```

### Jobs

```json
{
  "title": "string",
  "company": "string",
  "location": "string",
  "status": "open"
}
```

### Applications

```json
{
  "jobId": "string",
  "candidateId": "string",
  "status": "applied"
}
```

---

## 🚀 Local Setup

```bash
git clone https://github.com/Devanshrocks4/SkillSnap.git

cd SkillSnap

npm install

npm run dev
```

---

## 🔮 Future Enhancements

* Resume Parsing
* AI Resume Ranking
* Interview Scheduling Automation
* Email Notifications
* Video Interview Integration
* Advanced Analytics Dashboard
* Multi-Company Support

---

## 👨‍💻 Developer

### Devansh Gupta

SkillSnap is a learning-focused full-stack recruitment platform showcasing modern web development practices, Firebase integration, authentication systems, cloud databases, and SaaS-style application architecture.

---

⭐ Feel free to explore the project and share feedback.

