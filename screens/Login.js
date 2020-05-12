import React, { useRef, useEffect, useState, useGlobal } from "reactn";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
} from "react-native";
import MeshStore from "../utils/meshStore";

import { validateLogin } from "../utils/validators";

import { LOGIN } from "../graphql/mutations";
import { GET_USER_BY_EMAIL } from "../graphql/queries";
import { UIActivityIndicator } from "react-native-indicators";
import { useMutation } from "@apollo/react-hooks";
import useImperativeQuery from "../utils/useImperativeQuery";

import getEnvVars from "../env";
const { AUTH_PROFILE_ID } = getEnvVars();

function Login(props) {
  const [activeChannel, setActiveChannel] = useGlobal("activeChannel");
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [activeRevision, setActiveRevision] = useGlobal("activeRevision");
  const [user, setUser] = useGlobal("user");
  const [pub, setPub] = useGlobal("pub");

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [login] = useMutation(LOGIN);
  const getUser = useImperativeQuery(GET_USER_BY_EMAIL);

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

  const goToRegister = () => props.navigation.navigate("register");
  const updateEmail = (text) => {
    setEmail(text.toLowerCase());
  };
  const updatePassword = (text) => {
    setPassword(text);
  };

  const goToPolicy = () => {
    Linking.openURL("https://www.athar.es/policy");
  };

  const tryLogin = async () => {
    setLoading(true);
    const isValid = validateLogin({ password, email });
    if (isValid !== undefined) {
      Alert.alert("Error", isValid[Object.keys(isValid)[0]][0]);
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

      console.log(res1, res2);
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
      const prom3 = MeshStore.setItem("ATHARES_ALIAS", email);
      const prom4 = MeshStore.setItem("ATHARES_TOKEN", idToken);

      // store password because 8base doesn't have a way to login via token
      const prom5 = MeshStore.setItem("ATHARES_PASSWORD", password);

      await Promise.all([prom3, prom4, prom5]);

      setUser(id);

      _isMounted.current && setLoading(false);

      props.navigation.navigate("app");
    } catch (err) {
      console.error(new Error(err));
      if (err.message.indexOf("Invalid Credentials") !== -1) {
        Alert.alert("Error", "Invalid Credentials");
      } else {
        Alert.alert("Error", err.message);
      }
      setLoading(false);
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
        <UIActivityIndicator color="#FFFFFF" />
      </View>
    );
  }
  // <Image
  //   style={{ height: 60, width: 60, marginBottom: 10 }}
  //   source={require("../assets/images/Athares-owl-logo-large-white-thin.png")}
  // />
  // <Image
  //   style={{ height: 20, width: 120, marginBottom: 25 }}
  //   source={require("../assets/images/Athares-type-small-white.png")}
  // />
  return (
    <View>
      <Text
        style={{
          marginBottom: 25,
          color: "#FFFFFF",
          fontFamily: "SpaceGrotesk",
        }}
      >
        Login to Athares
      </Text>
      <TextInput
        icon="at-sign"
        placeholder="email"
        onChangeText={updateEmail}
        value={email}
      />
      <TextInput
        icon="lock"
        placeholder="password"
        secureTextEntry
        onChangeText={updatePassword}
        value={password}
      />

      <TouchableOpacity onPress={tryLogin}>
        <Text>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToRegister}>
        <Text>I need to register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ width: "100%", paddingHorizontal: 15, alignItems: "center" }}
        onPress={goToPolicy}
      >
        <Text style={{ color: "#FFF", alignItems: "center" }}>
          By logging in you acknowledge that you agree to the Terms of Use and
          Privacy Policy.
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;
