import React, { useRef, useEffect, useState } from "reactn";
import { View, StyleSheet } from "react-native";

import MeshAlert from "../../utils/meshAlert";

import * as RootNavigation from "../../navigation/RootNavigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateEmailAddress } from "../../utils/validators";

import { CREATE_RESET_REQUEST } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";

import Input from "../../components/Input";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [createResetRequest] = useMutation(CREATE_RESET_REQUEST);

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

  const sendRequest = async () => {
    setLoading(true);
    const isValid = validateEmailAddress({ email });
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
      await createResetRequest({
        variables: {
          email,
        },
      });

      _isMounted.current && setLoading(false);

      RootNavigation.navigate("resetConfirm");
    } catch (err) {
      MeshAlert({
        title: "Error",
        text: "Unable to send reset request",
        icon: "error",
      });
      setLoading(false);
    }
  };

  if (loading) {
    return <CenteredLoaderWithText text={"Sending Reset Request..."} />;
  }

  return (
    <View style={styles.justifyBetween}>
      <KeyboardAwareScrollView>
        <DisclaimerText
          text={`To reset your password, we need the email with which you created the account. Please enter it below.`}
        />
        <Input onChangeText={updateEmail} value={email} label={"Email"} />
        <GlowButton text={"Request Password Reset"} onPress={sendRequest} />
      </KeyboardAwareScrollView>
      <DisclaimerText
        style={styles.center}
        text={`After pressing "Request Password Reset", you will receive an email with a confirmation code to reset your password.`}
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
