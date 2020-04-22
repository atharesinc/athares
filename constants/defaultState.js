import { Dimensions } from "react-native";

export default {
  user: null,
  activeCircle: null,
  activeRevision: null,
  activeAmendment: null,
  pub: null,
  circles: [],
  revisions: [],
  showSearch: false,
  dmSettings: false,
  showAddMoreUsers: false,
  searchParams: "",
  isOnline: false,
  dimensions: {
    ...Dimensions.get("window"),
  },
  activeTheme: "light",
};
