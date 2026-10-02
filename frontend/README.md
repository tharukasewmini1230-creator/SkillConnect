# 🎓 SkillSwap

**A Student Skill Exchange and Learning Platform**

Learn from peers. Swap skills. Grow together.

Built with the MERN stack (MongoDB, Express, React, Node.js) + Socket.IO

---

## 📚 Project Overview

**SkillSwap** is a full-stack web application that allows university students to exchange skills with each other. Instead of paying for expensive courses, students can teach what they know and learn what they don't — all within a trusted student community.

This project is built as part of the **EC4307 - Web Application Development** module.

### 🎯 Core Concept

Instead of simply searching for a skill, SkillSwap uses a **smart matching algorithm** that finds:
- Students who can teach you what **you want to learn**
- AND want to learn what **you can teach**

This creates a **perfect two-way skill swap** — the signature feature of the platform.

---

## ✨ Features

### 🔐 Authentication & User Management
- Register and login with JWT-based authentication
- Secure password hashing with bcryptjs
- User profiles with university, skills offered, and skills wanted
- Settings page: Update profile, change password, notification preferences, dark mode

### 🎓 Skill Management
- Create, read, update, and delete skill posts
- Two types: **Offer** (I can teach) and **Request** (I want to learn)
- Categories: Programming, Design, Languages, Music, Academic, Other
- Search and filter skills by keyword and category

### 🤝 Skill Exchange Matching (Signature Feature)
- Smart algorithm computes a **match score (0-100%)** between users
- Identifies **perfect matches** (two-way skill exchange)
- Shows which skills each user can teach the other
- Sorted by match percentage

### 📅 Session Booking & Management
- Dedicated booking page with skill and mentor info
- Session summary with live preview
- Date, time, and mode (Online/Physical) selection
- Accept, reject, complete, or cancel sessions
- Automatic +10 points for both users on session completion

### ⭐ Reviews & Ratings
- 5-star rating system for completed sessions
- Written reviews with comments
- Average rating displayed on user profiles
- +5 bonus points for 5-star reviews

### 🏆 Gamification System
- **Points System**: Earn points for skills (+5), sessions (+10), and 5-star reviews (+5)
- **Leaderboard**: Top students ranked by points, top mentors by completed sessions
- **Achievements**: Unlock 6 badges by completing milestones
- **Points Badge** in top navigation bar

### 💬 Real-time Messaging (Socket.IO)
- One-to-one chat between students
- Real-time message delivery (no page refresh needed)
- Typing indicators
- Online/Offline status
- Read receipts
- Conversation list with unread counts

### 🔔 Notifications
- Real-time notification system
- Types: Session requests, accepts, rejects, completions, new messages, new reviews
- Unread count badge in navigation bar
- Mark as read (individual or all)

### 🎨 User Experience
- Modern Blue/Indigo/Purple color scheme
- **Dark Mode** support
- Fully responsive (desktop, tablet, mobile)
- Sidebar navigation for dashboard pages
- Beautiful illustrations and smooth animations

---

## 🛠️ Technologies Used

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Socket.IO** | Real-time communication |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variables |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React** | UI library |
| **Vite** | Build tool |
| **React Router** | Client-side routing |
| **Axios** | HTTP client |
| **Socket.IO Client** | Real-time messaging |

---

## 📂 Project Structure
