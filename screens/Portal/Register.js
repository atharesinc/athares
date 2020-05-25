import React, {
  Fragment,
  useState,
  useGlobal,
  useRef,
  useEffect,
} from "reactn";

import {
  TouchableOpacity,
  Linking,
  View,
  Alert,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import MeshStore from "../../utils/meshStore";
import * as RootNavigation from "../../navigation/RootNavigation";

import { validateRegister } from "../../utils/validators";
import { UIActivityIndicator } from "react-native-indicators";

import Input from "../../components/Input";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";

import getEnvVars from "../../env";

import { SIGN_UP, LOGIN } from "../../graphql/mutations";
import { useMutation } from "@apollo/react-hooks";

const { DEFAULT_USER_IMG, AUTH_PROFILE_ID } = getEnvVars();

function Register(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setUser] = useGlobal("user");

  const [error, setError] = useState("");

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
    Linking.openURL("https://www.athares.us/policy");
  };

  const toLogin = () => props.navigation.navigate("login");

  const tryRegister = async (e) => {
    setLoading(true);

    const isValid = validateRegister({
      firstName,
      lastName,
      password,
      email,
    });

    if (isValid !== undefined) {
      Alert.alert("Error", isValid[Object.keys(isValid)[0]][0]);
      setLoading(false);
      return false;
    }

    // Auth0's arbitrary stupid auth requirements
    if (/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/.test(password) === false) {
      Alert.alert(
        "Error",
        "Password must contain a capital letter, a lowercase letter, and a number."
      );
      setLoading(false);
      return false;
    }

    try {
      // // Encrypt the user's private key in the database with the password
      // let simpleCrypto = new SimpleCrypto(password);
      // let keys = await pair();

      const newUser = {
        firstName,
        lastName,
        email,
        icon: DEFAULT_USER_IMG,
        prefs: { create: { maySendMarketingEmail: true, userDisabled: false } },
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
            success,
          },
        },
      } = res2;

      const {
        data: {
          userSignUpWithPassword: { id },
        },
      } = res1;

      //store locally
      const prom1 = MeshStore.setItem("ATHARES_ALIAS", email);
      const prom2 = MeshStore.setItem("ATHARES_TOKEN", idToken);

      // store password because 8base doesn't have a way to login via token
      const prom3 = MeshStore.setItem("ATHARES_PASSWORD", password);

      await Promise.all([prom1, prom2, prom3]);

      setUser(id);

      _isMounted.current && setLoading(false);

      RootNavigation.navigate("app");
    } catch (err) {
      // console.log(err.message, err.details);
      setLoading(false);
      console.error(new Error(err));
      if (err.message.indexOf("The user already exists") !== -1) {
        Alert.alert("Error", "A user already exists with this email address.");
      } else {
        Alert.alert("Error", err.message);
      }
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <UIActivityIndicator
          color="#FFFFFF"
          style={{ flex: 1, marginBottom: 15 }}
        />
        <Text>Building Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Input label="First Name" onChangeText={setFirstName} value={firstName} />
      <Input label="Last Name" onChangeText={setLastName} value={lastName} />
      <Input label="Email" onChangeText={updateEmail} value={email} />
      <Input
        label="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      {error !== "" && <Text style={{ color: "#FF0000" }}>{error}</Text>}

      <GlowButton text={"Register"} onPress={tryRegister} />

      <TouchableOpacity onPress={goToPolicy}>
        <DisclaimerText
          text={
            "By registering you acknowledge that you agree to the Terms of Use and Privacy Policy."
          }
        />
      </TouchableOpacity>
    </ScrollView>
  );
}

export default Register;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 13,
  },
});
