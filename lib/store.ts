import { create } from 'zustand';

interface User {
  userId: string;
  email: string;
  name: string;
}

interface Participant {
  socketId: string;
  userId: string;
  email: string;
  name: string;
}

interface Message {
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  setToken: (token: string, user: User) => void;
  logout: () => void;
}

interface RoomStore {
  roomId: string | null;
  participants: Participant[];
  messages: Message[];
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isMuted: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  setRoomId: (roomId: string) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (userId: string) => void;
  addMessage: (message: Message) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  addRemoteStream: (userId: string, stream: MediaStream) => void;
  removeRemoteStream: (userId: string) => void;
  setIsMuted: (isMuted: boolean) => void;
  setIsCameraOn: (isCameraOn: boolean) => void;
  setIsScreenSharing: (isScreenSharing: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  
  setToken: (token: string, user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ token, user });
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ token: null, user: null });
  }
}));

export const useRoomStore = create<RoomStore>((set) => ({
  roomId: null,
  participants: [],
  messages: [],
  localStream: null,
  remoteStreams: new Map(),
  isMuted: false,
  isCameraOn: true,
  isScreenSharing: false,
  
  setRoomId: (roomId: string) => set({ roomId }),
  setParticipants: (participants: Participant[]) => set({ participants }),
  addParticipant: (participant: Participant) => set((state) => ({
    participants: [...state.participants, participant]
  })),
  removeParticipant: (userId: string) => set((state) => ({
    participants: state.participants.filter((p) => p.socketId !== userId)
  })),
  addMessage: (message: Message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setLocalStream: (stream: MediaStream | null) => set({ localStream: stream }),
  addRemoteStream: (userId: string, stream: MediaStream) => set((state) => ({
    remoteStreams: new Map(state.remoteStreams).set(userId, stream)
  })),
  removeRemoteStream: (userId: string) => set((state) => {
    const newMap = new Map(state.remoteStreams);
    newMap.delete(userId);
    return { remoteStreams: newMap };
  }),
  setIsMuted: (isMuted: boolean) => set({ isMuted }),
  setIsCameraOn: (isCameraOn: boolean) => set({ isCameraOn }),
  setIsScreenSharing: (isScreenSharing: boolean) => set({ isScreenSharing })
}));
