import { create } from 'zustand'
import { persist, createJSONStorage } from "zustand/middleware";
import { setCookie, getCookie, deleteCookie } from '@/utils/cookies';

type User = {
    id: string;
    email: string;
    role: string;
    // any other fields you need
};


type SessionState = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setUser: (user: User) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
};

const useUserSession = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user: User) => {
        set({ user });
        // Persist user data in cookies
        setCookie('user', JSON.stringify(user), { expires: 7, path: '/' });
      },
      setTokens: (accessToken: string) => {
        set({ accessToken });
        // Persist accessToken in cookies
        setCookie('accessToken', accessToken, { expires: 7, path: '/' });
      },
      logout: () => {
        set({ user: null, accessToken: null });
        // Remove user data and token from cookies
        deleteCookie('user');
        deleteCookie('accessToken');
      },
    }),
    {
      name: 'user-session', 
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export default useUserSession;