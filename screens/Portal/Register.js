import React, { useState, useGlobal, useRef, useEffect } from "reactn";

import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import MeshStore from "../../utils/meshStore";
import * as RootNavigation from "../../navigation/RootNavigation";

import { validateRegister } from "../../utils/validators";
import MeshAlert from "../../utils/meshAlert";

import Input from "../../components/Input";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";

import getEnvVars from "../../env";

import { SIGN_UP, LOGIN } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";

const { DEFAULT_USER_IMG, AUTH_PROFILE_ID } = getEnvVars();

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setUser] = useGlobal("user");

  const [error] = useState("");

  const [signup] = useMutation(SIGN_UP);
  const [login] = useMutation(LOGIN);
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

  const goToPolicy = () => {
    RootNavigation.navigate("privacy");
  };

  const tryRegister = async () => {
    setLoading(true);

    const isValid = validateRegister({
      firstName,
      lastName,
      password,
      email,
    });

    if (isValid !== undefined) {
      MeshAlert({
        title: "Error",
        text: isValid[Object.keys(isValid)[0]][0],
        icon: "error",
      });
      setLoading(false);
      return false;
    }

    // Auth0's arbitrary stupid auth requirements
    // if (/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/.test(password) === false) {
    //   MeshAlert({
    //     title: "Error",
    //     text:
    //       "Password must contain a capital letter, a lowercase letter, and a number.",
    //     icon: "error",
    //   });
    //   setLoading(false);
    //   return false;
    // }

    try {
      // // Encrypt the user's private key in the database with the password
      // let simpleCrypto = new SimpleCrypto(password);
      // let keys = await pair();

      const newUser = {
        firstName,
        lastName,
        email,
        icon: DEFAULT_USER_IMG,
        prefs: {
          create: {
            maySendMarketingEmail: true,
            userDisabled: false,
          },
        },
      };

      // first try to register
      let res1 = await signup({
        variables: {
          user: newUser,
          authProfileId: AUTH_PROFILE_ID,
          password,
        },
      });

      // login so we can get the token for future logins
      const res2 = await login({
        variables: {
          authProfileId: AUTH_PROFILE_ID,
          email,
          password,
        },
      });

      const {
        data: {
          userLogin: {
            auth: { idToken },
          },
        },
      } = res2;

      const {
        data: {
          userSignUpWithPassword: { id },
        },
      } = res1;

      //store locally
      MeshStore.setItemSync("ATHARES_ALIAS", email);
      MeshStore.setItemSync("ATHARES_TOKEN", idToken);

      // store password because 8base doesn't have a way to login via token
      MeshStore.setItemSync("ATHARES_PASSWORD", password);

      setUser(id);

      _isMounted.current && setLoading(false);

      RootNavigation.navigate("app");
    } catch (err) {
      setLoading(false);
      console.error(new Error(err));

      if (err.message.indexOf("The user already exists") !== -1) {
        MeshAlert({
          title: "Error",
          text: "A user already exists with this email address.",
          icon: "error",
        });
      } else {
        MeshAlert({ title: "Error", text: err.message, icon: "error" });
      }
    }
  };

  if (loading) {
    return <CenteredLoaderWithText text={"Building Profile..."} />;
  }

  return (
    <View style={styles.justifyBetween}>
      <KeyboardAwareScrollView>
        <Input
          label="First Name"
          onChangeText={setFirstName}
          value={firstName}
        />
        <Input label="Last Name" onChangeText={setLastName} value={lastName} />
        <Input
          label="Email"
          onChangeText={updateEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="email"
        />
        <Input
          label="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          blurOnSubmit={true}
        />
        {error !== "" && <Text style={{ color: "#FF0000" }}>{error}</Text>}

        <GlowButton text={"Register"} onPress={tryRegister} />
      </KeyboardAwareScrollView>
      <TouchableOpacity onPress={goToPolicy} style={styles.center}>
        <DisclaimerText style={styles.center}>
          By registering you acknowledge that you agree to the{" "}
          <DisclaimerText blue>Terms of Use and Privacy Policy.</DisclaimerText>
        </DisclaimerText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  justifyBetween: { justifyContent: "space-between", flex: 1 },
  center: {
    textAlign: "center",
  },
});
