import { defineStore } from "pinia";
import  ACCESS_ENUM  from "../access/ACCESS_ENUM.js";
import myAxios from "../plugins/myAxios";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: {
      id: null,
      userName: null,
      userRole: ACCESS_ENUM.NOT_LOGIN,
      userAvatar: null,
      token: null,
    },
  }),
  actions:{
    isLoggedIn() {
      myAxios.get("/user/getLoginUser").then(r => {
        this.userInfo = r.data.data;
      })
      return this.userInfo.token !== null;
    },
    getToken() {
      return this.userInfo.token;
    }
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
      if (this.history.length > 5) {
        this.history = this.history.slice(0, 5);
      }
      if (this.history.includes(item)) {
        return;
      }
      this.history = [item, ...this.history];
    },
  },
  persist: {
    storage: localStorage,
    key: "history",
  },
});

export const useErrorStore = defineStore('error', {
  state: () => ({
    errorType: null, // 错误类型
    errorMessage: '', // 错误消息
  }),
  actions: {
    setError(type, message) {
      this.errorType = type;
      this.errorMessage = message;
    },
    clearError() {
      this.errorType = null;
      this.errorMessage = '';
    },
  },
});

export const useUserCryptoStore = defineStore('userCrypto', {
  state: () => ({
    publicKey: '',
  }),
  actions: {
    setPublicKey(key: string) {
      this.publicKey = key
    },
    clearPublicKey() {
      this.publicKey = ''
    },
  },
})
