import { Platform } from "react-native";

import createSecureStore from "@neverdull-agency/expo-unlimited-secure-store";
import localforage from "localforage";

const useLocalForage = Platform.OS === "web";

const MeshStore = {
  secureStore: null,
  init: function () {
    // initialize different storage drivers based on platform
    if (useLocalForage) {
      localforage.config({
        driver: localforage.INDEXEDDB,
        name: "athares",
        storeName: "ath_store",
        description: "athares secure store",
      });
    } else {
      this.secureStore = createSecureStore();
    }
  },
  getItem: function (key) {
    if (useLocalForage) {
      return localforage.getItem(key);
    }
    return this.secureStore.getItem(key);
  },
  setItem: function (key, value) {
    if (useLocalForage) {
      return localforage.setItem(key, value);
    }
    return this.secureStore.setItem(key, value);
  },
  removeItem: function (key) {
    if (useLocalForage) {
      return localforage.removeItem(key);
    }
    return this.secureStore.removeItem(key);
  },
  clear: function () {
    if (useLocalForage) {
      return Promise.all([
        localforage.removeItem("ATHARES_ALIAS"),
        localforage.removeItem("ATHARES_PASSWORD"),
        localforage.removeItem("ATHARES_TOKEN"),
        localforage.removeItem("theme"),
      ]);
    }
    return Promise.all([
      this.secureStore.removeItem("ATHARES_ALIAS"),
      this.secureStore.removeItem("ATHARES_PASSWORD"),
      this.secureStore.removeItem("ATHARES_TOKEN"),
      this.secureStore.removeItem("theme"),
    ]);
  },
};

export default MeshStore;
