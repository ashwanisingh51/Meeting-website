# MeetHub: Video Meeting App

A video meeting app where people create a room, share the room code and talk in real time. Video and audio go directly between browsers using WebRTC, and a Node.js server handles sign-in and signalling.

**Stack:** Next.js, React, TypeScript, Tailwind CSS, Zustand, Node.js, Express, Socket.IO, WebRTC, JWT, Docker

## Features

- Create a meeting room or join one with a room code
- Live audio and video between participants (WebRTC with Google STUN servers)
- In-room text chat
- Mute and camera on/off controls, with the status shown to others
- Join and leave notifications and a live participant list
- Simple JWT sign-in with name and email
- Docker and Docker Compose setup

## How it works

1. A user signs in and gets a JWT from `POST /api/auth/token`.
2. They create a room (`POST /api/rooms`) or join an existing one with its code.
3. The browser connects to the Socket.IO server and joins the room.
4. Browsers exchange WebRTC offers, answers and ICE candidates through the server, then stream media directly to each other.
5. Chat messages and mute/camera states travel through Socket.IO events.

## Project structure

```text
├── app/                 # Next.js pages: sign in, home, room/[roomId]
├── lib/
│   ├── store.ts         # Zustand store (user and room state)
│   └── useWebRTC.ts     # WebRTC peer connection hook
├── server.js            # Express + Socket.IO backend
├── Dockerfile           # frontend image
├── Dockerfile.backend   # backend image
└── docker-compose.yml
```

## Run locally

Requires Node.js 18 or newer.

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root (it is git-ignored). Use your own random `JWT_SECRET`:

```text
PORT=3001
JWT_SECRET=<a long random string>
CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

3. Start the frontend (port 3000) and backend (port 3001) together:

```bash
npm run dev:all
```

Or with Docker:

```bash
docker compose up --build
```

## Known limitations

- Rooms are stored in server memory, so they are lost when the server restarts
- Sign-in only asks for a name and email, with no password
- Screen sharing has a signalling event but the capture itself is not built yet
- Peer-to-peer WebRTC works well for small meetings but does not scale to large groups without a media server

## Next steps

- Add screen sharing with `getDisplayMedia`
- Store rooms in a database
- Add a TURN server for users behind strict firewalls
