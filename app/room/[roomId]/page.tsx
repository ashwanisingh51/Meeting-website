'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore, useRoomStore } from '@/lib/store';
import { useWebRTC } from '@/lib/useWebRTC';

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const roomStore = useRoomStore();
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const { toggleMute, toggleCamera, sendMessage, leaveRoom, error } =
    useWebRTC(token, roomId);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  const handleLeaveRoom = () => {
    leaveRoom();
    roomStore.setRoomId(null);
    router.push('/home');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Meeting Room: {roomId}</h1>
          <p className="text-sm text-gray-400">{roomStore.participants.length} participants</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showChat ? 'Hide Chat' : 'Show Chat'}
          </button>
          <button
            onClick={handleLeaveRoom}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Leave
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 text-white px-4 py-2">
          Error: {error}
        </div>
      )}

      <div className="flex-1 flex">
        {/* Video Container */}
        <div className="flex-1 p-4 overflow-hidden">
          <div
            ref={videoContainerRef}
            className="grid gap-4 h-full"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`
            }}
          >
            {/* Local Stream */}
            <div className="bg-gray-800 rounded-lg overflow-hidden relative group">
              <video
                autoPlay
                muted
                playsInline
                ref={(ref) => {
                  if (ref && roomStore.localStream) {
                    ref.srcObject = roomStore.localStream;
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
                You ({user?.name})
              </div>
            </div>

            {/* Remote Streams */}
            {Array.from(roomStore.remoteStreams.entries()).map(
              ([peerId, stream]) => {
                const participant = roomStore.participants.find(
                  (p) => p.socketId === peerId
                );
                return (
                  <div
                    key={peerId}
                    className="bg-gray-800 rounded-lg overflow-hidden relative"
                  >
                    <video
                      autoPlay
                      playsInline
                      ref={(ref) => {
                        if (ref) {
                          ref.srcObject = stream;
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
                      {participant?.name}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 text-white flex flex-col border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold">Chat</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {roomStore.messages.map((msg, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-semibold text-blue-400">
                    {msg.userName}
                  </div>
                  <div className="text-gray-300 break-words">{msg.message}</div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-700 flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 text-white p-4 flex justify-center gap-4">
        <button
          onClick={toggleMute}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            roomStore.isMuted
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {roomStore.isMuted ? '🔇' : '🎤'} {roomStore.isMuted ? 'Unmute' : 'Mute'}
        </button>

        <button
          onClick={toggleCamera}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            !roomStore.isCameraOn
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {roomStore.isCameraOn ? '📹' : '📴'}{' '}
          {roomStore.isCameraOn ? 'Camera On' : 'Camera Off'}
        </button>

        <button
          onClick={handleLeaveRoom}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 font-semibold"
        >
          ☎️ Leave Call
        </button>
      </div>
    </div>
  );
}
