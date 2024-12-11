import { defineStore } from "pinia";

// @ts-ignore
export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: {
      name: "",
      role: "",
      avatarUrl: "",
      token: "",
    },
  }),
  persist: {
    storage: localStorage,
    key: "user",
  }
});

// @ts-ignore
export const useHistoryStore = defineStore("history", {
  state: () => ({
    history: [],
  }),
  persist: {
    storage: localStorage,
    key: "history",
  },
});
