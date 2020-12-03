export const linkingConfig = {
  prefixes: ["https://athar.es", "athares://", "http://localhost:19006"],
  config: {
    screens: {
      splash: "",
      about: "about",
      roadmap: "roadmap",
      privacy: "privacy",
      // GOOD
      app: "/app",
      // GOOD
      portal: {
        screens: {
          login: "login",
          register: "register",
          forgot: "forgot",
          resetConfirm: "reset",
          reset: "reset/:hashedCode",
        },
      },
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
      notFound: "*",
    },
  },
};
