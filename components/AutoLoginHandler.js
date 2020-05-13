import React, { useEffect, useGlobal } from "reactn";

import { LOGIN } from "../graphql/mutations";
import { GET_USER_BY_EMAIL } from "../graphql/queries";
import { useMutation } from "@apollo/react-hooks";
import useImperativeQuery from "../utils/useImperativeQuery";
import MeshStore from "../utils/meshStore";

import getEnvVars from "../env";
const { AUTH_PROFILE_ID } = getEnvVars();

export default function AutoLoginHandler(props) {
  const [, setUser] = useGlobal("user");

  // for auto login
  const [login] = useMutation(LOGIN);
  const getUser = useImperativeQuery(GET_USER_BY_EMAIL);

  useEffect(() => {
    async function tryLoginOnMount() {
      try {
        // also see if we can login
        const prom1 = MeshStore.getItem("ATHARES_PASSWORD");
        const prom2 = MeshStore.getItem("ATHARES_ALIAS");
        const [password, email] = await Promise.all([prom1, prom2]);

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

          // console.log(res1, res2);
          const {
            data: {
              user: { id },
            },
          } = res1;

          const {
            data: {
              userLogin: {
                auth: { idToken },
                success,
              },
            },
          } = res2;

          //store locally
          await MeshStore.setItem("ATHARES_TOKEN", idToken);

          setUser(id);
        } else {
          console.log("No credentials saved, skipping auto login");
        }
      } catch (err) {
        console.error(new Error(err));
      }
    }
    tryLoginOnMount();
  }, []);
  return null;
}