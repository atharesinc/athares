import { Dimensions, Platform } from "react-native";
import { themes } from "./themes";

const dimensions = Dimensions.get("window");
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
  isOnline: true,
  dimensions: {
    ...dimensions,
  },
  activeTheme: themes["light"],
  isMobile: Platform.OS !== "web" || dimensions.width <= 576,
  isMenuOpen: false,
  unreadChannels: [],
  showConstSearch: false,
};
