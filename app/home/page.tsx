'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!token) {
    router.push('/');
    return null;
  }

  const handleCreateRoom = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rooms`,
        { token, roomName: `Room for ${user?.name}` }
      );
      const { roomId } = response.data;
      router.push(`/room/${roomId}`);
    } catch (err) {
      setError('Failed to create room');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    try {
      // Verify room exists
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${roomCode}`
      );
      router.push(`/room/${roomCode}`);
    } catch (err) {
      setError('Room not found');
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MeetHub</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.name}</span>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Room Card */}
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Start a Meeting
            </h2>
            <p className="text-gray-600 mb-6">
              Create a new meeting room and invite others to join
            </p>
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Creating Room...' : 'Create New Room'}
            </button>
          </div>

          {/* Join Room Card */}
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Join a Meeting
            </h2>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                maxLength="10"
              />
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📹</div>
            <h3 className="text-xl font-bold mb-2">HD Video & Audio</h3>
            <p className="text-gray-600">Crystal clear video and audio quality</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
            <p className="text-gray-600">Real-time messaging with participants</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🖥️</div>
            <h3 className="text-xl font-bold mb-2">Screen Share</h3>
            <p className="text-gray-600">Share your screen with everyone</p>
          </div>
        </div>
      </div>
    </div>
  );
}
