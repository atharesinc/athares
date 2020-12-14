import React, { useRef, useEffect, useState, useGlobal } from "reactn";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import MeshStore from "../../utils/meshStore";
import MeshAlert from "../../utils/meshAlert";

import * as RootNavigation from "../../navigation/RootNavigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateLogin } from "../../utils/validators";

import { LOGIN, GET_REFRESH_TOKEN } from "../../graphql/mutations";
import { GET_USER_BY_EMAIL } from "../../graphql/queries";
import { useMutation } from "@apollo/client";
import useImperativeQuery from "../../utils/useImperativeQuery";

import Input from "../../components/Input";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";

import getEnvVars from "../../env";
const { AUTH_PROFILE_ID } = getEnvVars();

export default function Login() {
  const [, setUser] = useGlobal("user");

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [login] = useMutation(LOGIN);
  const [getRefreshedToken] = useMutation(GET_REFRESH_TOKEN);
  const getUser = useImperativeQuery(GET_USER_BY_EMAIL);

  let _isMounted = useRef(false);

  useEffect(() => {
    _isMounted.current = true;

    return () => {
      _isMounted.current = false;
    };
  }, []);

  const updateEmail = (text) => {
    setEmail(text.toLowerCase());
  };

  const updatePassword = (text) => {
    setPassword(text);
  };

  const goToPolicy = () => {
    RootNavigation.navigate("privacy");
  };

  const goToForgot = () => {
    RootNavigation.navigate("portal", { screen: "forgot" });
  };

  const tryLogin = async () => {
    setLoading(true);
    const isValid = validateLogin({ password, email });
    if (isValid !== undefined) {
      MeshAlert({
        title: "Error",
        text: isValid[Object.keys(isValid)[0]][0],
        icon: "error",
      });
      setLoading(false);
      return false;
    }
    try {
      // login so we can get the token for authorization
      const prom1 = getUser({
        email,
      });

      const prom2 = login({
        variables: {
          authProfileId: AUTH_PROFILE_ID,
          email,
          password,
        },
      });

      const [res1, res2] = await Promise.all([prom1, prom2]);

      const {
        data: {
          user: { id },
        },
      } = res1;

      const {
        data: {
          userLogin: {
            auth: { idToken },
          },
        },
      } = res2;

      //store locally
      MeshStore.setItemSync("ATHARES_ALIAS", email);
      MeshStore.setItemSync("ATHARES_TOKEN", idToken);

      // store password because 8base doesn't have a way to login via token
      MeshStore.setItemSync("ATHARES_PASSWORD", password);

      setUser(id);

      _isMounted.current && setLoading(false);

      RootNavigation.navigate("app");
    } catch (err) {
      console.error(err);
      if (err.message.indexOf("The request is invalid") !== -1) {
        MeshAlert({
          title: "Error",
          text: "Incorrect username or password",
          icon: "error",
        });
      } else if (err.message.indexOf("Invalid Credentials") !== -1) {
        MeshAlert({
          title: "Error",
          text: "Invalid Credentials",
          icon: "error",
        });
      } else if (err.message.indexOf("Token expired") !== -1) {
        refreshToken();
      } else {
        MeshAlert({ title: "Error", text: err.message, icon: "error" });
      }
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    // get refreshed token from storage
    const token = await MeshStore.getItem("ATHARES_TOKEN");

    // get new token with query
    let res = await getRefreshedToken({
      variables: {
        email,
        token,
        profileId: AUTH_PROFILE_ID,
      },
    });

    // store new token
    await MeshStore.setItem("ATHARES_TOKEN", res.refreshToken);

    // try to login again
    tryLogin();
  };

  if (loading) {
    return <CenteredLoaderWithText text={"Authorizing..."} />;
  }

  return (
    <View style={styles.justifyBetween}>
      <KeyboardAwareScrollView>
        <Input onChangeText={updateEmail} value={email} label={"Email"} />
        <Input
          secureTextEntry
          onChangeText={updatePassword}
          value={password}
          label={"Password"}
          nextSibling={
            <TouchableOpacity onPress={goToForgot}>
              <DisclaimerText blue text={"Forgot Password?"} />
            </TouchableOpacity>
          }
        />
        <GlowButton text={"Login"} onPress={tryLogin} />
      </KeyboardAwareScrollView>

      <TouchableOpacity
        onPress={goToPolicy}
        style={styles.center}
        // style={
        //   {
        //     // justifyContent: "flex-end",
        //     // alignItems: "flex-end",
        //     // height: 5,
        //     // margin: 0,
        //     // padding: 0,
        //   }
        // }
      >
        <DisclaimerText style={styles.center}>
          By logging in you acknowledge that you agree to the{" "}
          <DisclaimerText
            blue
            // noMargin
            // style={{ marginBottom: -5 }}
          >
            Terms of Use and Privacy Policy.
          </DisclaimerText>
        </DisclaimerText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  justifyBetween: { justifyContent: "space-between", flex: 1 },
  center: {
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
});
