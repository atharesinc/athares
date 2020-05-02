import { Dimensions } from "react-native";
import { themes } from "./themes";

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
  activeTheme: themes["light"],
};
