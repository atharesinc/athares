import React, { useRef, useEffect, useState } from "reactn";
import { View, StyleSheet } from "react-native";

import MeshAlert from "../../utils/meshAlert";

import * as RootNavigation from "../../navigation/RootNavigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { GET_RESET_REQUEST } from "../../graphql/queries";
import { sha } from "../../utils/crypto";

import Input from "../../components/Input";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import useImperativeQuery from "../../utils/useImperativeQuery";

export default function ResetConfirm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const checkResetRequest = useImperativeQuery(GET_RESET_REQUEST);

  let _isMounted = useRef(false);

  useEffect(() => {
    _isMounted.current = true;

    return () => {
      _isMounted.current = false;
    };
  }, []);

  const updateCode = (text) => {
    setCode(text.toUpperCase());
  };

  const sendRequest = async () => {
    setLoading(true);
    if (code.length !== 6) {
      MeshAlert({
        title: "Error",
        text: "Not a valid code",
        icon: "error",
      });
      setLoading(false);
      return false;
    }
    try {
      let hashedCode = sha(code.toUpperCase());

      await checkResetRequest({
        token: hashedCode,
      });

      _isMounted.current && setLoading(false);

      RootNavigation.navigate("reset", {
        hashedCode: sha(code),
      });
    } catch (err) {
      MeshAlert({ title: "Error", text: err.message, icon: "error" });
      setLoading(false);
    }
  };

  if (loading) {
    return <CenteredLoaderWithText text={"Verifying Reset Request..."} />;
  }

  return (
    <View style={styles.justifyBetween}>
      <KeyboardAwareScrollView>
        <DisclaimerText
          text={`You should have received an email with a code to reset your request; please enter it now.`}
        />
        <Input onChangeText={updateCode} value={code} label={"Reset Code"} />
        <GlowButton text={"Verify Code"} onPress={sendRequest} />
      </KeyboardAwareScrollView>
      <DisclaimerText
        style={styles.center}
        text={`After pressing "Verify Code", we'll make sure that code is valid and let you reset your password.`}
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
