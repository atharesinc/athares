import { Platform } from "react-native";

export default function getImageSize(width = 1920) {
  // If the user isn't on a mobile platform, always give them the best version
  if (Platform.OS !== "web") {
    return require(`../assets/images/iss-4k.jpg`);
  }

  if (width <= 1366) {
    return require(`../assets/images/iss-1366_x_768.jpg`);
  }
  if (width <= 1920) {
    return require(`../assets/images/iss-1920_x_1080.jpg`);
  }

  return require(`../assets/images/iss-4k.jpg`);
}
