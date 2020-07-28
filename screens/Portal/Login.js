import React, {
  useRef,
  useEffect,
  useState,
  useGlobal,
  Fragment,
} from "reactn";
import {
  View,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import MeshStore from "../../utils/meshStore";
import * as RootNavigation from "../../navigation/RootNavigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateLogin } from "../../utils/validators";

import { LOGIN } from "../../graphql/mutations";
import { GET_USER_BY_EMAIL } from "../../graphql/queries";
import { UIActivityIndicator } from "react-native-indicators";
import { useMutation } from "@apollo/client";
import useImperativeQuery from "../../utils/useImperativeQuery";

import Input from "../../components/Input";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import Title from "../../components/Title";

import getEnvVars from "../../env";
const { AUTH_PROFILE_ID } = getEnvVars();

function Login(props) {
  const [, setUser] = useGlobal("user");

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [login] = useMutation(LOGIN);
  const getUser = useImperativeQuery(GET_USER_BY_EMAIL);

  let _isMounted = useRef(false);

  useEffect(() => {
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

      RootNavigation.navigate("app");
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
    return <CenteredLoaderWithText text={"Authorizing..."} />;
  }

  return (
    <KeyboardAwareScrollView>
      <View>
        <Input onChangeText={updateEmail} value={email} label={"Email"} />
        <Input
          secureTextEntry
          onChangeText={updatePassword}
          value={password}
          label={"Password"}
        />
        <GlowButton text={"Login"} onPress={tryLogin} />
      </View>
      <TouchableOpacity onPress={goToPolicy}>
        <DisclaimerText
          text={
            "By logging in you acknowledge that you agree to the Terms of Use and Privacy Policy."
          }
        />
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

export default Login;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
