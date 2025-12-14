# Quick Start Guide - MeetHub

## 🚀 Get Started in 5 Minutes

### Step 1: Terminal 1 - Start Backend Server
```powershell
cd "c:\Users\pandit\OneDrive\Desktop\mee\meeting"
npm run server:dev
```
Expected output:
```
Server running on http://localhost:3001
```

### Step 2: Terminal 2 - Start Frontend
```powershell
cd "c:\Users\pandit\OneDrive\Desktop\mee\meeting"
npm run dev
```
Expected output:
```
> Next.js started (port 3000)
```

### Step 3: Open in Browser
- Go to: **http://localhost:3000**
- Login with your name (email optional)
- Create a new room or join with code

### Step 4: Test with Multiple Users
1. Create a room in one browser tab
2. Copy the room code
3. Open new private/incognito window
4. Login and paste the room code
5. See real-time video/audio connection!

---

## 📋 Features You Can Test

✅ **Video & Audio**
- Should see your video in the first tab
- Should see other person's video in second tab
- Audio is live and real-time

✅ **Mute/Camera Controls**
- Click mute button to disable audio
- Click camera button to disable video
- Changes reflected for all participants

✅ **Chat**
- Type messages in chat panel
- Messages appear in real-time
- Shows sender name and timestamp

✅ **Participant List**
- See all users in the room
- Shows participant count
- Join/leave notifications

---

## 🔧 Configuration

### Environment Variables (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Change Port Numbers
- **Frontend**: Edit in `next.config.ts` or run with `-p` flag
- **Backend**: Set `PORT` env variable or edit `server.js`

---

## 🐛 Troubleshooting

### "Cannot access camera/microphone"
- Check browser permissions
- Allow camera/microphone in browser settings
- Try different browser

### "No video showing"
- Refresh page
- Check DevTools console for errors
- Restart backend server

### "Cannot join room"
- Verify room code is correct
- Check if room creator is still in the room
- Try creating a new room

### Backend not starting
```powershell
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run server:dev
```

---

## 📦 Production Deployment

### Docker (Recommended)
```bash
# Build
docker-compose build

# Run
docker-compose up
```

### Manual Deployment
1. Build Next.js: `npm run build`
2. Start: `npm start` (frontend) + `npm run server` (backend)
3. Point to your domain in `.env.production`

---

## 🎯 Next Steps

After basic testing, try:
1. Adding more participants (up to 4-6)
2. Testing on mobile devices
3. Stress testing with longer sessions
4. Customizing UI/branding

---

## 💡 Tips

- **Best Performance**: Use Chrome/Edge (WebRTC optimized)
- **Mobile Testing**: Use ngrok to expose localhost
- **Screen Share**: Framework ready, can add easily
- **Recording**: Use browser extensions or OBS

---

Questions? Check the main **README_APP.md** for detailed documentation.

Happy meeting! 🎥
