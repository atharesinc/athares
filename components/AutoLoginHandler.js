import { useEffect, useCallback, useGlobal } from "reactn";

import { LOGIN } from "../graphql/mutations";
import { GET_USER_BY_EMAIL } from "../graphql/queries";
import { useMutation } from "@apollo/client";
import useImperativeQuery from "../utils/useImperativeQuery";
import MeshStore from "../utils/meshStore";

import getEnvVars from "../env";
const { AUTH_PROFILE_ID } = getEnvVars();

export default function AutoLoginHandler() {
  const [, setUser] = useGlobal("user");

  // for auto login
  const [login] = useMutation(LOGIN);
  const getUser = useImperativeQuery(GET_USER_BY_EMAIL);

  const tryLoginOnMount = useCallback(
    async function () {
      try {
        // also see if we can login
        const password = MeshStore.getItemSync("ATHARES_PASSWORD");
        const email = MeshStore.getItemSync("ATHARES_ALIAS");

        if (email && password) {
          // login so we can get the token for auth
          const prom3 = getUser({
            email,
          });

          const prom4 = login({
            variables: {
              authProfileId: AUTH_PROFILE_ID,
              email,
              password,
            },
          });

          const [res1, res2] = await Promise.all([prom3, prom4]);

          const {
            data: {
              user: { id },
            },
          } = res1;

          const {
            data: {
              userLogin: {
                auth: { idToken },
                // success,
              },
            },
          } = res2;

          //store locally
          MeshStore.setItemSync("ATHARES_TOKEN", idToken);
          setUser(id);
        }
      } catch (err) {
        if (err.message.includes("expired")) {
          MeshStore.clear();
          return;
        }
        console.error(new Error(err));
      }
    },
    [login, getUser]
  );

  useEffect(() => {
    tryLoginOnMount();
  }, []);

  return null;
}
