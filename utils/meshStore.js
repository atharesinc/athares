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
    if (useLocalForage) {
      return localforage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    if (useLocalForage) {
      return localforage.setItem(key, value);
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    if (useLocalForage) {
      return localforage.removeItem(key);
    }
    return SecureStore.deleteItemAsync(key);
  },
  clear: () => {
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
  },
};

export default MeshStore;
