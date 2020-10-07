import React, { useGlobal, useEffect, useState } from "reactn";
import { ScrollView, StyleSheet, View } from "react-native";

import {
  UPDATE_EMAIL_PERMISSION_FOR_CIRCLE,
  UPDATE_AMENDEMENT_PERMISSION_FOR_CIRCLE,
  UPDATE_REVISION_PERMISSION_FOR_CIRCLE,
  DELETE_USER_FROM_CIRCLE,
} from "../../graphql/mutations";

import {
  GET_CIRCLE_PREFS_FOR_USER,
  GET_CIRCLES_BY_USER_ID,
} from "../../graphql/queries";

import { useQuery, useMutation } from "@apollo/client";

import SwitchLine from "../../components/SwitchLine";
import Title from "../../components/Title";
import DisclaimerText from "../../components/DisclaimerText";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";

import GlowButton from "../../components/GlowButton";

function CircleSettings(props) {
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");

  const [loading, setLoading] = useState(false);

  const [_updateEmailPref] = useMutation(UPDATE_EMAIL_PERMISSION_FOR_CIRCLE);
  const [_updateAmendmentPref] = useMutation(
    UPDATE_AMENDEMENT_PERMISSION_FOR_CIRCLE
  );
  const [_updateRevisionPref] = useMutation(
    UPDATE_REVISION_PERMISSION_FOR_CIRCLE
  );

  const [deleteUserFromCircle] = useMutation(DELETE_USER_FROM_CIRCLE, {
    refetchQueries: [
      {
        query: GET_CIRCLES_BY_USER_ID,
        variables: {
          id: user || "",
        },
      },
    ],
  });

  const { loading: loadingQuery, error, data } = useQuery(
    GET_CIRCLE_PREFS_FOR_USER,
    {
      variables: {
        circle: activeCircle || "",
        user: user || "",
      },
    }
  );

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

  useEffect(() => {
    if (!activeCircle) {
      props.navigation.navigate("app");
    }
  }, [activeCircle]);

  const leaveCircle = async () => {
    setLoading(true);
    try {
      let { id } = permissions;

      await deleteUserFromCircle({
        variables: {
          user,
          circle: activeCircle,
          permission: id,
        },
      });

      setActiveCircle(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loadingQuery) {
    return <CenteredLoaderWithText text={"Getting Settings"} />;
  }

  if (loading) {
    return <CenteredLoaderWithText text={"Leaving Circle"} />;
  }

  if (error) {
    return <CenteredErrorLoader text={"Error Getting Settings"} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Title text={"Notification Preferences"} />
      <DisclaimerText
        text={
          "Set your communication preferences for this Circle. By default you will receive an email notification when a new revision is created, and when a revision has passed or been rejected."
        }
      />
      <SwitchLine
        label={"Allow Email Notifications"}
        value={permissions.useEmail}
        onPress={updateEmailPref}
      />
      {permissions.useEmail && (
        <View style={{ paddingLeft: 15 }}>
          <SwitchLine
            label={"Notify on New Revision"}
            value={permissions.revisions}
            onPress={updateRevisionPref}
          />
          <SwitchLine
            label={"Notify on New Amendment"}
            value={permissions.amendment}
            onPress={updateAmendmentPref}
          />
        </View>
      )}
      {/* Leave Circle */}
      <Title text={"Leave Circle"} red style={styles.marginTop} />
      <DisclaimerText
        text={`By pressing "Leave Circle" you will be removed from all Circle communication. You will not be able to use its channels or vote in polls. If you would like to return to this Circle at a later time, you will need to be re-invited by someone inside the Circle.`}
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
    padding: 15,
  },
  marginTop: { marginTop: 20 },
});

export default CircleSettings;
