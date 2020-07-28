import sha256 from "hash.js/lib/hash/sha/256";
import { Crypt } from "hybrid-crypto-js";

import getEnvVars from "../env";

import MeshStore from "./meshStore";

const { AUTH_URL, APP_VERSION } = getEnvVars();

const crypt = new Crypt();

export function sha(text) {
  return sha256().update(text).digest("hex");
}

/** Generate and store keypair */
export async function pair() {
  const token = await MeshStore.getItem("ATHARES_TOKEN");

  return fetch(`${AUTH_URL}/pair`, {
    mode: "cors",
    headers: {
      Authorization: "Bearer " + token,
      AppVersion: APP_VERSION,
    },
  }).then((res) => {
    return res.json();
  });
}

/** Encrypt the provided string with the destination public key */
export function encrypt(content, publicKey) {
  return crypt.encrypt(publicKey, content);
}

/** Decrypt the provided string with the private key */
export function decrypt(content, privateKey) {
  return crypt.decrypt(privateKey, content).message;
}
