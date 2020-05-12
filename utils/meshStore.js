import { Platform } from "react-native";

import * as SecureStore from "expo-secure-store";
import localforage from "localforage";

const useLocalForage = Platform.OS === "web";

const MeshStore = {
  init: () => {
    // we only need to do this on the web, but we can call it in App.js and it won't hurt anything
    if (useLocalForage) {
      localforage.config({
        driver: localforage.INDEXEDDB,
        name: "athares",
        storeName: "ath_store",
        description: "athares secure store",
      });
    }
  },
  getItem: (key) => {
    try {
      if (useLocalForage) {
        return localforage.getItem(key);
      }
      return SecureStore.getItemAsync(key);
    } catch (e) {
      throw e;
    }
  },
  setItem: (key, value) => {
    try {
      if (useLocalForage) {
        return localforage.setItem(key, value);
      }
      return SecureStore.setItemAsync(key, value);
    } catch (e) {
      throw e;
    }
  },
  removeItem: (key) => {
    try {
      if (useLocalForage) {
        return localforage.removeItem(key);
      }
      return SecureStore.deleteItemAsync(key);
    } catch (e) {
      throw e;
    }
  },
  clear: () => {
    try {
      if (useLocalForage) {
        return Promise.all([
          localforage.removeItem("ATHARES_ALIAS"),
          localforage.removeItem("ATHARES_PASSWORD"),
          localforage.removeItem("ATHARES_TOKEN"),
          localforage.removeItem("theme"),
        ]);
      }
      return Promise.all([
        SecureStore.deleteItemAsync("ATHARES_ALIAS"),
        SecureStore.deleteItemAsync("ATHARES_PASSWORD"),
        SecureStore.deleteItemAsync("ATHARES_TOKEN"),
        SecureStore.deleteItemAsync("theme"),
      ]);
    } catch (e) {
      throw e;
    }
  },
};

export default MeshStore;
