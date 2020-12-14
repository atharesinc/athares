import { Platform } from "react-native";

import createSecureStore from "@neverdull-agency/expo-unlimited-secure-store";
import localforage from "localforage";

const useLocalForage = Platform.OS === "web";

const MeshStore = {
  secureStore: null,
  _map: null,
  keys: [
    "ATHARES_ALIAS",
    "ATHARES_PASSWORD",
    "ATHARES_TOKEN",
    "theme",
    "searched_circles",
  ],
  loading: false,
  init: function () {
    // initialize in-memory store for frequent access values that we need synchronously
    this._map = new Map();
    this.loading = true;
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

    const keyPromises = this.keys.map((key) => {
      return this.getItem(key);
    });

    Promise.all(keyPromises).then((values) => {
      values.forEach((v, i) => {
        this._map.set(this.keys[i], v);
      });
    });
  },
  getItemSync: function (key) {
    // immediately get the in-memory value
    return this._map.get(key);
  },
  setItemSync: function (key, value) {
    // set item with persistent storage so we can grab it on the next load
    this.setItem(key, value);

    // but return with the synchronous value immediately
    return this._map.set(key, value);
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
    this._map.clear();
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
