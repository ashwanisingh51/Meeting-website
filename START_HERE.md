# 🎥 MeetHub - Getting Started Now!

## ⚡ Start in 30 Seconds

### Step 1: Open 2 PowerShell Windows

**Window 1:**
```powershell
cd "c:\Users\pandit\OneDrive\Desktop\mee\meeting"
npm run server:dev
```

**Window 2:**
```powershell
cd "c:\Users\pandit\OneDrive\Desktop\mee\meeting"
npm run dev
```

### Step 2: Open Browser
```
http://localhost:3000
```

### Step 3: Test
1. Enter name → Click Login
2. Click "Create New Room"
3. Copy room code
4. Open new **private window** (Ctrl+Shift+P)
5. Paste room code → Click Join
6. See both videos live! 🎉

---

## 📁 Project Files Location

```
c:\Users\pandit\OneDrive\Desktop\mee\meeting\
```

### Key Files
```
app/page.tsx              ← Login
app/home/page.tsx         ← Dashboard
app/room/[roomId]/page.tsx ← Video call
lib/store.ts              ← State management
lib/useWebRTC.ts          ← WebRTC logic
server.js                 ← Backend
```

---

## 📚 Documentation (Read in Order)

1. **This File** - Start here (you are here!)
2. **QUICKSTART.md** - 5 minute guide
3. **README_APP.md** - Full documentation
4. **SETUP_COMPLETE.md** - Detailed guide

---

## ✨ Features Ready to Use

✅ **Video & Audio** - Real-time streaming
✅ **Mute/Camera** - Toggle controls
✅ **Chat** - Real-time messaging
✅ **Participants** - See who's in room
✅ **Mobile Friendly** - Works on phones

---

## 🔧 Environment Setup

### Automatic (Already Done)
- ✅ `.env.local` created
- ✅ All packages installed (npm install)
- ✅ TypeScript configured
- ✅ Tailwind CSS ready

### Verify Everything
```powershell
cd "c:\Users\pandit\OneDrive\Desktop\mee\meeting"
node -v    # Should show v24.11.1 or similar
npm -v     # Should show 11.6.2 or similar
dir server.js   # Should show the file exists
```

---

## 🎯 What You Just Got

### Frontend (Port 3000)
- Login page with name/email
- Dashboard to create/join rooms
- Video conference room
- Chat sidebar
- Media controls
- Responsive design

### Backend (Port 3001)
- Express HTTP server
- Socket.io WebSocket server
- JWT authentication
- Room management
- Signaling for WebRTC
- Real-time events

### WebRTC
- Peer-to-peer audio/video
- ICE candidate handling
- SDP offer/answer exchange
- Automatic connection management

### Deployment
- Docker support
- Docker Compose ready
- Cloud deployment ready

---

## 🚀 Common Commands

### Development
```powershell
npm run dev         # Start frontend (port 3000)
npm run server:dev  # Start backend (port 3001)
npm run build       # Build for production
npm run lint        # Check code quality
```

### Production
```powershell
npm run start       # Start frontend production
npm run server      # Start backend production
npm run build       # Build frontend
```

### Docker
```powershell
docker-compose up              # Start all
docker-compose down            # Stop all
docker-compose up --build      # Rebuild
docker-compose logs -f         # View logs
```

---

## 🎨 Customization Guide

### Change App Name
**File:** `app/page.tsx` (Line ~42)
```tsx
// Change this:
<h1>MeetHub</h1>
// To this:
<h1>Your Company Meeting</h1>
```

### Change Colors
**File:** `app/page.tsx`, `app/home/page.tsx`, `app/room/[roomId]/page.tsx`
```tsx
// Search for color classes like:
bg-blue-500      // Primary blue
bg-purple-600    // Secondary purple
// And change to your colors
```

### Change Logo
1. Add image to `public/` folder
2. Import in `app/layout.tsx`
```tsx
import Image from 'next/image'
<Image src="/your-logo.png" alt="logo" width={100} height={40} />
```

---

## 🧪 Testing Checklist

### Test 1: Basic Flow
- [ ] Visit http://localhost:3000
- [ ] Enter name
- [ ] Click Login
- [ ] Should see dashboard

### Test 2: Create Room
- [ ] Click "Create New Room"
- [ ] Should see room code
- [ ] Should see your video
- [ ] Should show "1 participants"

### Test 3: Join Room
- [ ] Copy room code
- [ ] Open new private window
- [ ] Go to http://localhost:3000
- [ ] Enter different name
- [ ] Click "Join Room"
- [ ] Paste room code
- [ ] Should see 2 participants
- [ ] Should see both videos

### Test 4: Media Controls
- [ ] Click mute (should turn red)
- [ ] Click camera (should turn red)
- [ ] Click again (should turn green)
- [ ] Both users see status change

### Test 5: Chat
- [ ] Type message in chat box
- [ ] Press Enter
- [ ] Should appear in both windows
- [ ] Should show your name
- [ ] Should have timestamp

### Test 6: Leave Room
- [ ] Click "Leave" button
- [ ] Should go back to dashboard
- [ ] Other user should see you left
- [ ] Participant count should decrease

---

## 🐛 Quick Troubleshooting

### "Cannot connect to backend"
```
✅ Solution:
1. Make sure npm run server:dev is running
2. Check port 3001 is not blocked
3. Verify firewall settings
```

### "No camera/microphone"
```
✅ Solution:
1. Check browser permissions
2. Chrome → Settings → Privacy → Camera
3. Grant permission and refresh
```

### "Backend won't start"
```
✅ Solution:
rm -r node_modules
npm install
npm run server:dev
```

### "Blank video"
```
✅ Solution:
1. Refresh page
2. Check browser console (F12)
3. Restart both frontend and backend
```

---

## 📊 What Each Component Does

### `app/page.tsx` - Login Page
- User enters name (email optional)
- Generates JWT token
- Redirects to dashboard

### `app/home/page.tsx` - Dashboard
- Create new room button
- Join room by code input
- Shows features
- Logout button

### `app/room/[roomId]/page.tsx` - Video Room
- Video grid for all participants
- Chat sidebar
- Media control buttons
- Leave button

### `lib/store.ts` - State Management
- User authentication state
- Room data (participants, messages)
- Local and remote streams
- Media control status

### `lib/useWebRTC.ts` - WebRTC Logic
- Initialize media (camera/mic)
- Create peer connections
- Handle offers/answers
- Manage ICE candidates
- Signal through Socket.io

### `server.js` - Backend Server
- HTTP API endpoints
- Socket.io event handlers
- Room management
- JWT validation
- Signaling relay

---

## 🌐 Architecture Overview

```
User 1 Browser              User 2 Browser
     ↓                            ↓
   Next.js (3000)        Next.js (3000)
     ↓                            ↓
   Connect via Socket.io ←→ Express Server (3001)
     ↓                            ↓
   WebRTC Peer Connection ←→ WebRTC Peer Connection
     ↓                            ↓
Video/Audio Stream ←→ Video/Audio Stream (Direct)
```

**Note:** Video/Audio goes peer-to-peer, only signaling through server!

---

## 📈 Next Steps

### Immediate
- [ ] Test locally (follow checklist above)
- [ ] Customize name/colors
- [ ] Try with 3-4 people

### This Week
- [ ] Deploy to Docker
- [ ] Set up custom domain
- [ ] Configure for HTTPS

### This Month
- [ ] Deploy to AWS/DigitalOcean
- [ ] Add screen sharing
- [ ] Database integration

### Future
- [ ] Mobile app
- [ ] Recording
- [ ] Advanced features

---

## 💡 Pro Tips

### Better Performance
- Use Chrome (best WebRTC support)
- Close other tabs
- Good internet connection
- Use Ethernet if possible

### Testing with Friends
- Share room code via chat
- Use mobile + desktop
- Test on different networks
- Check video quality

### Debugging
- Press F12 → Console for errors
- chrome://webrtc-internals for stats
- Network tab for WebSocket
- Application tab for storage

---

## 🔐 Security Notes

### Current Setup
- JWT tokens expire after 24h
- CORS configured
- Environment secrets in .env.local

### Before Production
- Change JWT_SECRET
- Enable HTTPS/WSS
- Configure TURN server
- Add rate limiting
- Use strong passwords

---

## 📞 Where to Get Help

### Documentation
1. **QUICKSTART.md** - Fast setup
2. **README_APP.md** - Complete ref
3. **SETUP_COMPLETE.md** - Detailed guide

### Browser DevTools (F12)
- Console → Check errors
- Network → Check WebSocket
- Application → Check storage

### Online Resources
- Next.js docs: https://nextjs.org/docs
- Socket.io docs: https://socket.io/docs
- WebRTC guide: https://webrtc.org/

---

## ✅ Verify Everything Works

### Quick Test Command
```powershell
# In project directory:
cd "c:\Users\pandit\OneDrive\Desktop\mee\meeting"

# Check files exist:
Test-Path server.js
Test-Path "app\page.tsx"
Test-Path "lib\useWebRTC.ts"

# Check dependencies:
npm list socket.io express

# Start backend:
npm run server:dev

# In another window:
npm run dev
```

---

## 🎓 Learning Path

### Day 1: Understand It
- Read QUICKSTART.md
- Run locally and test
- Explore the code

### Day 2: Customize It
- Change colors/name
- Add your logo
- Modify welcome page

### Day 3: Deploy It
- Follow deployment guide
- Deploy to cloud
- Get your own domain

### Day 4+: Enhance It
- Add screen sharing
- Implement recording
- Add database
- Scale to production

---

## 🎉 You're Ready!

Everything is set up and ready to go. 

**Next:** Open 2 PowerShell windows and follow the "Start in 30 Seconds" section at the top!

---

## 📋 Final Checklist

- [x] Project created
- [x] All files generated
- [x] Dependencies installed
- [x] Configuration set
- [x] Documentation written
- [ ] **YOUR TURN:** Run and test!

**Let's go! 🚀**

---

**Quick Links:**
- 📖 QUICKSTART.md
- 📚 README_APP.md  
- 🛠️ SETUP_COMPLETE.md
- ✨ FEATURES_COMPLETE.md

**Status:** ✅ Ready to Use
**Version:** 1.0 MVP
**Last Updated:** December 3, 2025
