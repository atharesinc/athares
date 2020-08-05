import MeshStore from "./meshStore";

const TOKEN_NAME = "ATHARES_TOKEN";

export const useAuthToken = async () => {
  const token = await MeshStore.getItem(TOKEN_NAME);

  // this function allows to save any string in our cookies, under the key "ATHARES_TOKEN"
  const setAuthToken = (authToken) => MeshStore.setItem(TOKEN_NAME, authToken);

  // this function removes the key "ATHARES_TOKEN" from our cookies. Useful to logout
  const removeAuthToken = () => MeshStore.removeItem(TOKEN_NAME);

  return [token, setAuthToken, removeAuthToken];
};
