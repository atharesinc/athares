import React, { useRef, useEffect, useState } from "reactn";
import { View, StyleSheet } from "react-native";

import MeshAlert from "../../utils/meshAlert";

import * as RootNavigation from "../../navigation/RootNavigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { UPDATE_PASSWORD } from "../../graphql/mutations";

import Input from "../../components/Input";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import { useMutation } from "@apollo/client";
import { validatePassword } from "../../utils/validators";

export default function ResetConfirm(props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetPassword] = useMutation(UPDATE_PASSWORD);

  let _isMounted = useRef(false);

  useEffect(() => {
    _isMounted.current = true;

    return () => {
      _isMounted.current = false;
    };
  }, []);

  const updatePassword = (text) => {
    setPassword(text);
  };

  const sendRequest = async () => {
    setLoading(true);
    //  validate password length
    const isValid = validatePassword({ password });

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
      await resetPassword({
        variables: {
          token: props.route.params.hashedCode,
          password,
        },
      });

      _isMounted.current && setLoading(false);

      RootNavigation.navigate("portal", { screen: "login" });
    } catch (err) {
      MeshAlert({ title: "Error", text: err.message, icon: "error" });
      setLoading(false);
    }
  };

  if (loading) {
    return <CenteredLoaderWithText text={"Updating Your Password"} />;
  }

  return (
    <View style={styles.justifyBetween}>
      <KeyboardAwareScrollView>
        <DisclaimerText
          text={`Please enter a new password to use with the email address that received this reset request.`}
        />
        <Input
          secureTextEntry
          onChangeText={updatePassword}
          value={password}
          label={"New Password"}
        />
        <GlowButton text={"Update Password"} onPress={sendRequest} />
      </KeyboardAwareScrollView>
      <DisclaimerText
        style={styles.center}
        text={`By pressing "Update Password", your password will be updated and you will be redirected to the login page. You may then use your new password to log in.`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  justifyBetween: { justifyContent: "space-between", flex: 1 },
  center: {
    textAlign: "center",
  },
});
