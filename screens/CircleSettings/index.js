import React, { useGlobal } from "reactn";
import { Text, ScrollView, StyleSheet, View } from "react-native";

import {
  UPDATE_EMAIL_PERMISSION_FOR_CIRCLE,
  UPDATE_AMENDEMENT_PERMISSION_FOR_CIRCLE,
  UPDATE_REVISION_PERMISSION_FOR_CIRCLE,
} from "../../graphql/mutations";

import { GET_CIRCLE_PREFS_FOR_USER } from "../../graphql/queries";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { UIActivityIndicator } from "react-native-indicators";

import SwitchLine from "../../components/SwitchLine";
import Title from "../../components/Title";
import DisclaimerText from "../../components/Title";

function CircleSettings(props) {
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");

  const [_updateEmailPref] = useMutation(UPDATE_EMAIL_PERMISSION_FOR_CIRCLE);
  const [_updateAmendmentPref] = useMutation(
    UPDATE_AMENDEMENT_PERMISSION_FOR_CIRCLE
  );
  const [_updateRevisionPref] = useMutation(
    UPDATE_REVISION_PERMISSION_FOR_CIRCLE
  );

  const { loading, error, data } = useQuery(GET_CIRCLE_PREFS_FOR_USER, {
    variables: {
      circle: activeCircle || "",
      user: user || "",
    },
  });

  //  de/restructure circle permisssion
  let permissions = null;
  if (data && data.circlePermissionsList) {
    permissions = data.circlePermissionsList.items[0];
  }

  const updateAmendmentPref = async (checked) => {
    await _updateAmendmentPref({
      variables: {
        id: permissions.id,
        flag: checked,
      },
    });
  };

  const updateRevisionPref = async (checked) => {
    await _updateRevisionPref({
      variables: {
        id: permissions.id,
        flag: checked,
      },
    });
  };

  const updateEmailPref = async (checked) => {
    await _updateEmailPref({
      variables: {
        id: permissions.id,
        flag: checked,
      },
    });
  };

  if (loading) {
    return (
      <View
        styles={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: activeTheme.COLORS.DARK,
        }}
      >
        <UIActivityIndicator color={"#FFFFFF"} style={{ flex: 0 }} />
        <Text style={styles.loadingText}>Loading Constitution</Text>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyles={styles.wrapper}>
      <Title text={"Notification Preferences"} />
      <DisclaimerText
        text={
          "Set your communication preferences for this Circle. By default you will receive an email notification when a new revision is created, and when a revision has passed or been rejected."
        }
      />
      <SwitchLine
        label={"Allow Email Notifications"}
        value={permission.useEmail}
        onPress={updateEmailPref}
      />
      {useEmail && (
        <View style={{ paddingLeft: 15 }}>
          <SwitchLine
            label={"Notify on New Revision"}
            value={permission.revisions}
            onPress={updateRevisionPref}
          />
          <SwitchLine
            label={"Notify on New Amendment"}
            value={permssion.amendment}
            onPress={updateAmendmentPref}
          />
        </View>
      )}
      {/* Leave Circle */}
      <Title text={"Leave Circle"} red />
      <DisclaimerText
        text={
          "Set your communication preferences for this Circle. By default you will receive an email notification when a new revision is created, and when a revision has passed or been rejected."
        }
        red
      />
      <GlowButton text="Leave Circle" onPress={leaveCircle} red />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    padding: 13,
  },
  preamble: {
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 15,
    width: "100%",
    textAlign: "center",
  },
});

export default CircleSettings;
