import { defineStore } from "pinia";

interface AuthState {
  userInfo: Auth.UserInfo;
}

export const useAuthStore = defineStore("auth-store", {
  //   state: (): AuthState => ({
  //     userInfo
  //   }),
  actions: {
    resetAuthStore() {},
  },
});
