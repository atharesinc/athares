/*
READ ME

Each screen in the screens property defines it's routing params & logic
with either a express-route-like param path:
Ex: ":circle/text" => athar.es/209384/text => params: {circle: 209384}

Or with a more complex object that defines it's param path,
a parse object of functions to extract/transform each param,
and a stringify object of functions to transform the path for displaying in the address bar
{
  path: "user/:user/:name?",
  // If we wanted the param variable to be `user-${user}` we can prepend it with the parse object
  parse: {
    user: (user) => `user-${user}`,
    name: (name) => name,
  },
  // When navigating in-app (not from a link), we can modify how the url address changes (this doesn't affect the param values)
  // In this example, we want to be able to accept a name param but not to display it in the address bar
  // When react-navigation updates the address bar the name part of the path will be replaced with an empty string
  stringify: {
    user: (user) => user,
    name: () => "",
}
*/

export const linkingConfig = {
  prefixes: ["https://athar.es", "athares://", "http://localhost:19006"],
  config: {
    screens: {
      // GOOD
      splash: "",
      // GOOD
      about: "about",
      // GOOD
      roadmap: "roadmap",
      // GOOD
      privacy: "privacy",
      // GOOD
      app: "app",
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
      createRevision: {
        path: ":circle/revisions/create/:name?",
        parse: {
          circle: (circle) => circle,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle,
          name: () => "",
        },
      },
      settings: "settings",
      // GOOD
      viewRevision: {
        path: ":circle/revisions/:revision/:name?",
        parse: {
          circle: (circle) => circle,
          revision: (revision) => revision,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle,
          revision: (revision) => revision,
          name: () => "",
        },
      },
      // GOOD
      createCircle: "circles/create",
      // GOOD
      circleSettings: {
        path: ":circle/settings/:name?",
        parse: {
          circle: (circle) => circle,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle,
          name: () => "",
        },
      },
      // GOOD
      constitution: {
        path: ":circle/constitution/:name?",
        parse: {
          circle: (circle) => circle,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle,
          name: () => "",
        },
      },
      // GOOD
      createChannel: {
        path: ":circle/channels/create/:name?",
        parse: {
          circle: (circle) => circle,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle,
          name: () => "",
        },
      },
      // GOOD
      channel: {
        path: ":circle/channel/:channel/:name?",
        parse: {
          circle: (circle) => circle,
          channel: (channel) => channel,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle,
          channel: (channel) => channel,
          name: () => "",
        },
      },
      // TBD
      news: {
        path: ":circle?/news/:name?",
        parse: {
          circle: (circle) => circle,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle || "",
          name: () => "",
        },
      },
      // GOOD
      revisions: {
        path: ":circle/revisions/:name?",
        parse: {
          circle: (circle) => circle,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle,
          name: () => "",
        },
      },
      // GOOD
      editAmendment: {
        path: ":circle/amendment/:amendment/edit/:name?",
        parse: {
          circle: (circle) => circle,
          amendment: (amendment) => amendment,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle,
          amendment: (amendment) => amendment,
          name: () => "",
        },
      },
      // GOOD
      addUser: {
        path: ":circle/users/add/:name?",
        parse: {
          circle: (circle) => circle,
          name: (name) => name,
        },
        stringify: {
          circle: (circle) => circle,
          name: () => "",
        },
      },
      // GOOD
      viewInvites: "invites",
      // GOOD
      viewUser: "profile",
      // GOOD
      viewOtherUser: {
        path: "user/:user/:name?",
        parse: {
          user: (user) => user,
          name: (name) => name,
        },
        stringify: {
          user: (user) => user,
          name: () => "",
        },
      },
      notFound: "*",
    },
  },
};
