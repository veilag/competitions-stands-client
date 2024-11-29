import { create } from 'zustand'
import {persist} from "zustand/middleware";

interface AuthState {
  token: string
  id: string

  setToken: (value: string) => void
  setId: (value: string) => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      id: "",

      setToken: value => set(() => ({
        token: value
      })),
      setId: value => set(() => ({
        id: value
      })),
    }),
    {
      name: "auth-store",
    }
  )
)

export default useAuthStore