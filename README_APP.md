# MeetHub - Video Conferencing Application

A full-featured video conferencing application built with Next.js, Node.js, Socket.io, and WebRTC.

## Features

### MVP Features Implemented ✅

- **Create/Join Meetings**: Generate room codes or join by code
- **Real-time Audio & Video**: HD video and audio streams using WebRTC
- **Text Chat**: Real-time messaging in meeting rooms
- **Media Controls**:
  - Mute/Unmute audio
  - Camera on/off toggle
  - Screen share ready (framework in place)
- **Participant Management**: See who's in the meeting, join/leave notifications
- **Authentication**: Simple JWT-based auth with name/email entry
- **Responsive UI**: Mobile-friendly interface with Tailwind CSS
- **Live Participant List**: Shows all active participants in the room

## Tech Stack

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **Socket.io Client** - Real-time communication
- **WebRTC** - Peer-to-peer media

### Backend
- **Node.js** - Runtime
- **Express** - Server framework
- **Socket.io** - WebSocket signaling
- **JWT** - Authentication
- **CORS** - Cross-origin support

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Orchestration

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. **Clone and navigate to the project:**
```bash
cd c:\Users\pandit\OneDrive\Desktop\mee\meeting
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

4. **Run the backend server (in one terminal):**
```bash
npm run server:dev
```

5. **Run the frontend (in another terminal):**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to `http://localhost:3000`

## Project Structure

```
meeting/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Login page
│   ├── home/
│   │   └── page.tsx        # Dashboard (create/join room)
│   └── room/
│       └── [roomId]/
│           └── page.tsx    # Video conferencing room
├── lib/
│   ├── store.ts           # Zustand store (auth, room state)
│   └── useWebRTC.ts       # WebRTC hook
├── server.js              # Express + Socket.io backend
├── Dockerfile             # Frontend container
├── Dockerfile.backend     # Backend container
├── docker-compose.yml     # Orchestration
└── package.json           # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/token` - Generate JWT token
  ```json
  {
    "email": "user@example.com",
    "name": "User Name"
  }
  ```

### Rooms
- `POST /api/rooms` - Create a new room
  ```json
  {
    "token": "jwt-token",
    "roomName": "Room name"
  }
  ```
- `GET /api/rooms/:roomId` - Get room info

## WebSocket Events

### Client → Server
- `join-room` - Join a room
- `offer` - Send SDP offer to peer
- `answer` - Send SDP answer to peer
- `ice-candidate` - Send ICE candidate
- `chat-message` - Send text message
- `mute-toggle` - Toggle mute status
- `camera-toggle` - Toggle camera status
- `leave-room` - Leave the room

### Server → Client
- `existing-participants` - List of current participants
- `user-joined` - New user joined
- `user-left` - User left the room
- `offer` - Received SDP offer
- `answer` - Received SDP answer
- `ice-candidate` - Received ICE candidate
- `chat-message` - Received text message
- `mute-status` - User mute status
- `camera-status` - User camera status

## Features in Detail

### Authentication Flow
1. User enters name/email on login page
2. Backend generates JWT token
3. Token stored in localStorage
4. Token used for all WebSocket connections

### Room Creation & Joining
1. Create Room: Generates random room ID (uppercase code)
2. Join Room: Paste room code to join existing meeting
3. Real-time participant updates

### WebRTC Connection
1. STUN servers configured for NAT traversal
2. Peer connections established between all participants
3. Signaling through Socket.io
4. Media streams exchanged via WebRTC

### Media Controls
- **Mute**: Disables audio tracks
- **Camera Toggle**: Enables/disables video tracks
- **Live Status Updates**: All participants see media status

### Chat
- Real-time text messages
- Timestamp tracking
- User identification
- Scrollable message history

## Deployment

### Using Docker Compose

1. **Build and run:**
```bash
docker-compose up --build
```

2. **Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### AWS/DigitalOcean Deployment

1. Build Docker images
2. Push to Docker Hub or ECR
3. Deploy to Elastic Container Service or App Platform
4. Configure TURN server for ICE connectivity

## Future Enhancements

- [ ] Screen sharing implementation
- [ ] Recording capabilities
- [ ] Jitsi/Mediasoup SFU for scaling >4 participants
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User accounts and room history
- [ ] Advanced security features
- [ ] Meeting scheduling
- [ ] Virtual backgrounds
- [ ] Noise suppression
- [ ] Hand raising
- [ ] Whiteboard sharing
- [ ] Mobile app (React Native)

## TURN Server Setup

For production, configure a TURN server:

### Coturn (Self-hosted)
```bash
sudo apt-get install coturn
# Edit /etc/coturn/turnserver.conf
sudo systemctl start coturn
```

### Or use a managed service
- AWS TURN
- Twilio TURN
- Xirsys TURN

## Troubleshooting

### No video/audio
- Check browser permissions
- Verify WebRTC firewall rules
- Ensure STUN servers are accessible

### Connection issues
- Verify Socket.io connection in DevTools
- Check firewall rules
- Test TURN server connectivity

### Chat not working
- Ensure Socket.io events are received
- Check browser console for errors
- Verify room ID is correct

## Performance Considerations

- **Max Participants**: Currently supports up to 4-6 participants per room
- **Bandwidth**: ~500 kbps per stream (1:1 mesh topology)
- **For >6 participants**: Implement SFU (Jitsi, Mediasoup)

## Security Notes

- Change JWT_SECRET in production
- Use HTTPS/WSS in production
- Validate room IDs server-side
- Rate limit API endpoints
- Sanitize chat messages
- Use TURN over SRTP

## License

MIT

## Support

For issues, feature requests, or improvements, please create an issue or pull request.

---

**Happy meeting! 🎥**
