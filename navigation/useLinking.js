import { useLinking } from "@react-navigation/native";
import { Linking } from "expo";

export const linking = {
  prefixes: ["https://athar.es", "athares://", "http:loalhost:19006"],
  // routes: [
  //   {
  //     name: 'register',

  //   },
  // ]
  config: {
    // Channels: "",
    login: { path: "login" },
    register: { path: "register" },
    news: { path: "news" },
    channels: { path: "app" },
    createCircle: { path: "createCircle" },
  },
};

export default function (containerRef) {
  return useLinking(containerRef, linking);
}
