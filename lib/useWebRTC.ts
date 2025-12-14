import { useEffect, useRef, useState } from 'react';
import { useRoomStore } from '@/lib/store';
import io from 'socket.io-client';

const STUN_SERVERS = [
  'stun:stun.l.google.com:19302',
  'stun:stun1.l.google.com:19302',
  'stun:stun2.l.google.com:19302'
];

export const useWebRTC = (token: string | null, roomId: string | null) => {
  const socketRef = useRef<any>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [error, setError] = useState<string | null>(null);
  
  const roomStore = useRoomStore();

  // Initialize WebRTC connection
  const initializeMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      roomStore.setLocalStream(stream);
      return stream;
    } catch (err) {
      setError('Failed to access camera/microphone');
      console.error('Error accessing media devices:', err);
      return null;
    }
  };

  // Create peer connection
  const createPeerConnection = (remotePeerId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        ...STUN_SERVERS.map(server => ({ urls: server })),
        {
          urls: ['turn:turn.example.com'],
          username: 'user',
          credential: 'pass'
        }
      ]
    });

    // Add local stream tracks
    if (roomStore.localStream) {
      roomStore.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, roomStore.localStream!);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('Received remote stream:', remotePeerId);
      roomStore.addRemoteStream(remotePeerId, event.streams[0]);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          to: remotePeerId,
          candidate: event.candidate,
          from: socketRef.current.id
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'failed' || 
          peerConnection.connectionState === 'disconnected') {
        peerConnection.close();
        peerConnectionsRef.current.delete(remotePeerId);
        roomStore.removeRemoteStream(remotePeerId);
      }
    };

    peerConnectionsRef.current.set(remotePeerId, peerConnection);
    return peerConnection;
  };

  // Initialize Socket.io connection
  useEffect(() => {
    if (!token || !roomId) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
      auth: { token }
    });

    // Join room
    socketRef.current.emit('join-room', { token, roomId });

    // Receive existing participants
    socketRef.current.on('existing-participants', async (participants: any[]) => {
      await initializeMediaStream();
      roomStore.setParticipants(participants);
      
      // Create offers for all existing participants
      for (const participant of participants) {
        if (participant.socketId !== socketRef.current.id) {
          const peerConnection = createPeerConnection(participant.socketId);
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socketRef.current.emit('offer', {
            to: participant.socketId,
            offer,
            from: socketRef.current.id
          });
        }
      }
    });

    // User joined
    socketRef.current.on('user-joined', async (data: any) => {
      const { user } = data;
      roomStore.addParticipant(user);
      
      // Wait a bit then create answer
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    // Receive offer
    socketRef.current.on('offer', async (data: any) => {
      const { from, offer } = data;
      
      if (!peerConnectionsRef.current.has(from)) {
        await initializeMediaStream();
      }
      
      const peerConnection = peerConnectionsRef.current.get(from) || createPeerConnection(from);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      socketRef.current.emit('answer', {
        to: from,
        answer,
        from: socketRef.current.id
      });
    });

    // Receive answer
    socketRef.current.on('answer', async (data: any) => {
      const { from, answer } = data;
      const peerConnection = peerConnectionsRef.current.get(from);
      
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Receive ICE candidate
    socketRef.current.on('ice-candidate', async (data: any) => {
      const { from, candidate } = data;
      const peerConnection = peerConnectionsRef.current.get(from);
      
      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    });

    // User left
    socketRef.current.on('user-left', (data: any) => {
      const { userId } = data;
      roomStore.removeParticipant(userId);
      const peerConnection = peerConnectionsRef.current.get(userId);
      if (peerConnection) {
        peerConnection.close();
        peerConnectionsRef.current.delete(userId);
      }
      roomStore.removeRemoteStream(userId);
    });

    // Chat message
    socketRef.current.on('chat-message', (message: any) => {
      roomStore.addMessage(message);
    });

    return () => {
      socketRef.current?.disconnect();
      peerConnectionsRef.current.forEach(pc => pc.close());
      peerConnectionsRef.current.clear();
    };
  }, [token, roomId]);

  // Control functions
  const toggleMute = () => {
    if (roomStore.localStream) {
      roomStore.localStream.getAudioTracks().forEach(track => {
        track.enabled = roomStore.isMuted;
      });
      roomStore.setIsMuted(!roomStore.isMuted);
      socketRef.current?.emit('mute-toggle', {
        roomId,
        muted: !roomStore.isMuted
      });
    }
  };

  const toggleCamera = () => {
    if (roomStore.localStream) {
      roomStore.localStream.getVideoTracks().forEach(track => {
        track.enabled = !roomStore.isCameraOn;
      });
      roomStore.setIsCameraOn(!roomStore.isCameraOn);
      socketRef.current?.emit('camera-toggle', {
        roomId,
        cameraOn: !roomStore.isCameraOn
      });
    }
  };

  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('chat-message', {
        message,
        roomId
      });
    }
  };

  const leaveRoom = () => {
    socketRef.current?.emit('leave-room', { roomId });
    roomStore.localStream?.getTracks().forEach(track => track.stop());
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
  };

  return {
    toggleMute,
    toggleCamera,
    sendMessage,
    leaveRoom,
    error,
    socket: socketRef.current
  };
};
