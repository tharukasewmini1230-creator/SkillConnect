const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// IMPORT ROUTES
// ============================================
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const matchRoutes = require('./routes/matchRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const pointsRoutes = require('./routes/pointsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

// ============================================
// USE ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/achievements', achievementRoutes);

// ============================================
// BASIC TEST ROUTE
// ============================================
app.get('/', (req, res) => {
  res.send('SkillConnect API is running...');
});

// ============================================
// CREATE HTTP SERVER
// ============================================
const httpServer = http.createServer(app);

// ============================================
// SETUP SOCKET.IO
// ============================================
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Store online users: Map<userId, socketId>
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // User joins (sends their userId)
  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} is online`);

    // Broadcast online users list to everyone
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  // Send message via socket
  socket.on('send_message', (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    // If receiver is online, send message to them
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', message);
    }
  });

  // Typing indicator
  socket.on('typing', ({ receiverId, senderName }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', { senderName });
    }
  });

  socket.on('stop_typing', ({ receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_stop_typing');
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    // Remove user from online list
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }

    // Broadcast updated online users list
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });
});

// ============================================
// DATABASE CONNECTION
// ============================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillconnect';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('MongoDB connection error:', err));