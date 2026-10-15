<div align="center">

# 🎓 SkillSwap

### Student Skill Exchange and Learning Platform

**Learn from peers. Share your skills. Grow together.**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-3B82F6?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.10-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

A full-stack **MERN** web application that allows university students to exchange skills with each other — teach what you know, learn what you don't, all within a trusted student community.

**Built as part of the EC4307 - Web Application Development module.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API](#-api-endpoints) • [Author](#-author)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Core Concept](#-core-concept)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [Project Structure](#-project-structure)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

## 🌟 Overview

**SkillSwap** is a student-powered platform designed to make learning accessible, collaborative, and free. Instead of paying for expensive courses, students can:

- 📚 **Teach** skills they already know
- 🎯 **Learn** skills they want to master
- 🤝 **Connect** with peers from their university
- 🏆 **Earn** points and achievements as they grow

The platform solves a real problem: **students want to learn new skills but can't afford paid courses, while others have valuable skills they can teach.**

---

## 🎯 Core Concept

In a real-world skill exchange setting, SkillSwap's **smart matching algorithm** finds:

- **You can teach → They want to learn**
- **They can teach → You want to learn**

This creates a **perfect two-way skill swap** — the signature feature of the platform.


---

## ✨ Features

### 🔐 Authentication & User Management
- **Email/Password authentication** with bcrypt hashing
- **Google OAuth 2.0** login (one-click signup)
- **JWT-based sessions** (30-day expiry)
- **Set Password** for Google users (dual login)
- **Profile management** with university details
- **Avatar support** (initial-based)

### 🎓 Skill Management
- Add skills you can **teach** (Offer)
- Add skills you want to **learn** (Request)
- Categorize: Programming, Design, Languages, Music, Academic, Other
- Automatic **+5 points** per skill

### 🎯 Smart Matching Algorithm
- **Bidirectional matching** — teach + learn
- **Match score** calculation (0-100%)
- **Perfect match** detection (90%+)
- Filter by skill, category, percentage

### 📅 Session Booking & Management
- Book sessions with matches
- Choose **date, time, mode** (Online/Physical)
- **Status workflow:** Pending → Accepted → Completed/Rejected
- Automatic notifications on status changes
- **+10 points** on completion (both users)

### ⭐ Reviews & Ratings
- 5-star rating system
- Written reviews after completed sessions
- Average rating on profile
- **+5 bonus points** for 5-star reviews

### 🏆 Gamification System
- **Points** earned through activity
- **Leaderboard** with top 10 students
- **6 Achievements:**
  - 🌱 First Skill
  - 🎓 Skill Master (5 skills)
  - 🎯 First Session
  - 🏆 10 Sessions
  - ⭐ Top Mentor
  - 🤝 Community Helper

### 💬 Real-time Messaging
- **Socket.IO** for instant delivery
- **Typing indicators**
- **Online/offline status**
- Unread message counters
- Conversation list with previews

### 🔔 Notifications
- Session requests, accepts, rejects, completions
- New reviews
- New messages
- Real-time badge updates

### 📚 Study Hub (Community Resources)
- **Upload** study materials (PDF, DOC, PPT, XLS, ZIP, images — 20MB max)
- **Browse** by category, type
- **Download** with count tracking
- **Filter** by "My Resources"
- Free community-shared learning

### 🎨 User Experience
- **Dark/Light theme** with instant toggle
- **Responsive design** (mobile, tablet, desktop)
- **Smooth animations** and transitions
- **Modern UI** with gradient accents
- **Search functionality**

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.8 | UI library |
| **React Router DOM** | 7.18.4 | Client-side routing |
| **Vite** | 8.3.0 | Build tool + dev server |
| **Axios** | 1.20.0 | HTTP client |
| **Socket.IO Client** | 4.8.4 | Real-time communication |
| **@react-oauth/google** | Latest | Google OAuth |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 24+ | Runtime |
| **Express.js** | 5.2.1 | Web framework |
| **MongoDB** | 9.10.2 | Database |
| **Mongoose** | 9.10.2 | ODM |
| **JWT** | 9.0.3 | Authentication |
| **bcryptjs** | 3.0.3 | Password hashing |
| **Socket.IO** | 4.8.4 | WebSocket server |
| **Multer** | Latest | File uploads |
| **google-auth-library** | Latest | Google OAuth verification |
| **dotenv** | 18.0.3 | Environment variables |
| **cors** | 2.8.6 | CORS handling |

---

## 🏗 Architecture


---

## 📸 Screenshots

### 🏠 Home Page
![Home](screenshots/home.png)

### 🔐 Login & Register
![Login](screenshots/login.png)
![Register](screenshots/register.png)

### 📊 Dashboard
![Dashboard](screenshots/dashboard.png)

### 🎯 Matches
![Matches](screenshots/matches.png)

### 📅 Sessions
![Sessions](screenshots/sessions.png)

### 📚 Study Hub
![Study Hub](screenshots/study-hub.png)

### 🏆 Leaderboard
![Leaderboard](screenshots/leaderboard.png)

### 🏅 Achievements
![Achievements](screenshots/achievements.png)

### 🌙 Dark Mode
![Dark Mode](screenshots/dark-mode.png)

---

## 🚀 Installation

### Prerequisites

- **Node.js** v20+ ([Download](https://nodejs.org/))
- **MongoDB** ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/atlas))
- **Git** ([Download](https://git-scm.com/))

### Clone Repository

```bash
git clone https://github.com/tharukasewmini1230-creator/SkillConnect.git
cd SkillConnect