// import { useLinking } from "@react-navigation/native";
// import { Linking } from "expo";

export const linking = {
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

// export default function (containerRef) {
//   return useLinking(containerRef, linking);
// }

export const linkingConfig = {
  prefixes: ["https://athar.es", "athares://", "http:localhost:19006"],
  config: {
    screens: {
      // GOOD
      app: "",
      circle: ":circle",
      // GOOD
      portal: "portal",
      // GOOD
      createRevision: ":circle/revisions/create",
      // GOOD
      viewRevision: ":circle/revisions/:revision",
      // GOOD
      createCircle: "circles/create",
      // GOOD
      circleSettings: ":circle/settings",
      // GOOD
      constitution: ":circle/constitution",
      // GOOD
      createChannel: ":circle/channels/create",
      // GOOD
      channel: ":circle/channel/:channel",
      // GOOD
      news: ":circle?/news",
      // GOOD
      revisions: ":circle/revisions",
      // GOOD
      editAmendment: ":circle/amendment/:amendment/edit",
      // GOOD
      addUser: ":circle/users/add",
      // GOOD
      viewInvites: "invites",
      // GOOD
      viewUser: "profile",
      // GOOD
      viewOtherUser: "user/:user",
    },
  },
};
