import { User } from "@/types/user.type";
import { create } from "zustand";

type UserStore = {
  user: User | undefined;

  setUser: (user: User | undefined) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,

  setUser: (user) =>
    set({
      user,
    }),
}));
