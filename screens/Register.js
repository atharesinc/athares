import React, {
  Fragment,
  useEffect,
  useState,
  useGlobal,
  useRef,
} from "reactn";

import {
  TouchableOpacity,
  Linking,
  Image,
  Text,
  View,
  Alert,
  TextInput,
} from "react-native";
import MeshStore from "../utils/meshStore";

import { validateRegister } from "../utils/validators";
import { UIActivityIndicator } from "react-native-indicators";

import getEnvVars from "../env";

import { SIGN_UP, LOGIN, CREATE_USER_PREF } from "../graphql/mutations";
import { useMutation } from "@apollo/react-hooks";

const { DEFAULT_USER_IMG, AUTH_PROFILE_ID } = getEnvVars();

function Register({ createUser, signinUser, createUserPref, ...props }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeChannel, setActiveChannel] = useGlobal("activeChannel");
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [activeRevision, setActiveRevision] = useGlobal("activeRevision");
  const [user, setUser] = useGlobal("user");
  const [pub, setPub] = useGlobal("pub");

  const [error, setError] = useState("");

  const [signup] = useMutation(SIGN_UP);
  const [login] = useMutation(LOGIN);
  const [createPrefs] = useMutation(CREATE_USER_PREF);
  let _isMounted = useRef(false);

  useEffect(() => {
    setActiveChannel(null);
    setActiveCircle(null);
    setActiveRevision(null);
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

      props.navigation.navigate("app");
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
    <>
      <TextInput
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        placeholder="Email Address"
        onChangeText={updateEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      {error !== "" && <Text style={{ color: "#FF0000" }}>{error}</Text>}

      <TouchableOpacity onPress={tryRegister}>
        <Text>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toLogin}>
        <Text>"I already have an account"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: "100%",
          paddingHorizontal: 15,
          alignItems: "center",
        }}
        onPress={goToPolicy}
      >
        <Text
          style={{
            color: "#FFF",
            alignItems: "center",
          }}
        >
          By registering you acknowledge that you agree to the Terms of Use and
          Privacy Policy.
        </Text>
      </TouchableOpacity>
    </>
  );
}

export default Register;
