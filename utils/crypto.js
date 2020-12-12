import { digestStringAsync } from "expo-crypto";

export async function sha(text) {
  return await digestStringAsync("SHA-256", text);
}
