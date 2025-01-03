import { defineStore } from "pinia";

// @ts-ignore
export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: {
      username: "",
      role: "",
      avatarUrl: "",
      token: "",
    },
  }),
  actions:() => {
    },

  persist: {
    storage: localStorage,
    key: "user",
  }
});

export const useArticleStore = defineStore("selectedArticle", {
  state: () => ({
    selectedArticle: null,
  }),
  actions: {
    setSelectedArticle(article: any) {
      this.selectedArticle = article;
    },
    getSelectedArticle() {
      return this.selectedArticle;
    },
  },
  persist: {
    storage: localStorage,
    key: "selectedArticle",
  },
});

export const useHistoryStore = defineStore("history", {
  state: () => ({
    history: [],
  }),
  actions: {
    addSearchHistory(item: any) {
      this.history = [item, ...this.history];
      if (this.history.length > 5) {
        this.history = this.history.slice(0, 5);
      } else if (this.history.includes(item)) {
        return;
      }
    },
  },
  persist: {
    storage: localStorage,
    key: "history",
  },
});
