import { create } from 'zustand'
import { persist, createJSONStorage } from "zustand/middleware";
import { setCookie, getCookie, deleteCookie } from '@/utils/cookies';

type User = {
  username: string;
  role: string;
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
        setCookie('user', JSON.stringify(user), { expires: 7, path: '/' });
      },
      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
        setCookie("accessToken", accessToken, { expires: 7, path: "/" });
        setCookie("refreshToken", refreshToken, { expires: 7, path: "/" });
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        deleteCookie("user");
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
      },
    }),
    {
      name: 'user-session', 
      storage: createJSONStorage(() => localStorage),
      // skipHydration: true,
    }
  )
);

export default useUserSession;