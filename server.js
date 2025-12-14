const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PORT = process.env.PORT || 3001;

// Store active rooms and participants
const rooms = new Map();
const users = new Map();

// Authentication middleware
const authenticateToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

// REST API Routes

// Generate token for user
app.post('/api/auth/token', (req, res) => {
  const { email, name } = req.body;
  
  if (!email && !name) {
    return res.status(400).json({ error: 'Email or name required' });
  }

  const token = jwt.sign(
    { userId: Math.random().toString(36).substr(2, 9), email, name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

// Create room
app.post('/api/rooms', (req, res) => {
  const { token, roomName } = req.body;
  const user = authenticateToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const roomId = Math.random().toString(36).substr(2, 9).toUpperCase();
  rooms.set(roomId, {
    id: roomId,
    name: roomName || `Room ${roomId}`,
    createdAt: new Date(),
    participants: [],
    createdBy: user.userId
  });

  res.json({ roomId });
});

// Get room info
app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json(room);
});

// WebSocket Events

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (data) => {
    const { token, roomId } = data;
    const user = authenticateToken(token);

    if (!user) {
      socket.emit('error', { message: 'Unauthorized' });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Add user to room
    socket.join(roomId);
    const userInfo = { socketId: socket.id, ...user };
    users.set(socket.id, { ...userInfo, roomId });
    room.participants.push(userInfo);

    // Notify others in room
    io.to(roomId).emit('user-joined', {
      userId: socket.id,
      user: userInfo,
      totalParticipants: room.participants.length
    });

    // Send existing participants to new user
    socket.emit('existing-participants', room.participants);
  });

  socket.on('offer', (data) => {
    const { to, offer, from } = data;
    io.to(to).emit('offer', { offer, from });
  });

  socket.on('answer', (data) => {
    const { to, answer, from } = data;
    io.to(to).emit('answer', { answer, from });
  });

  socket.on('ice-candidate', (data) => {
    const { to, candidate, from } = data;
    io.to(to).emit('ice-candidate', { candidate, from });
  });

  socket.on('chat-message', (data) => {
    const userSocket = users.get(socket.id);
    if (userSocket) {
      const { message, roomId } = data;
      io.to(roomId).emit('chat-message', {
        userId: socket.id,
        userName: userSocket.name,
        message,
        timestamp: new Date()
      });
    }
  });

  socket.on('screen-share', (data) => {
    const { roomId, sharing } = data;
    io.to(roomId).emit('screen-share-update', {
      userId: socket.id,
      sharing
    });
  });

  socket.on('mute-toggle', (data) => {
    const { roomId, muted } = data;
    io.to(roomId).emit('mute-status', {
      userId: socket.id,
      muted
    });
  });

  socket.on('camera-toggle', (data) => {
    const { roomId, cameraOn } = data;
    io.to(roomId).emit('camera-status', {
      userId: socket.id,
      cameraOn
    });
  });

  socket.on('leave-room', (data) => {
    const { roomId } = data;
    const userInfo = users.get(socket.id);

    if (userInfo) {
      const room = rooms.get(roomId);
      if (room) {
        room.participants = room.participants.filter(p => p.socketId !== socket.id);
        io.to(roomId).emit('user-left', {
          userId: socket.id,
          totalParticipants: room.participants.length
        });
      }
      users.delete(socket.id);
    }
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    const userInfo = users.get(socket.id);
    if (userInfo) {
      const room = rooms.get(userInfo.roomId);
      if (room) {
        room.participants = room.participants.filter(p => p.socketId !== socket.id);
        io.to(userInfo.roomId).emit('user-left', {
          userId: socket.id,
          totalParticipants: room.participants.length
        });
      }
      users.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
