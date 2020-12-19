import { Platform } from "react-native";

export default function getImageSize(width = 1920) {
  // If the user isn't on a mobile platform, always give them the best version
  if (Platform.OS !== "web") {
    return "4k";
  }

  if (width <= 1366) {
    return "1366_x_768";
  }
  if (width <= 1920) {
    return "1920_x_1080";
  }

  return "4k";
}
