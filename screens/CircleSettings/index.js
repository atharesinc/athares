import React, { useGlobal, useEffect, useState } from "reactn";
import { ScrollView, StyleSheet, View } from "react-native";

import { DELETE_USER_FROM_CIRCLE } from "../../graphql/mutations";

import {
  GET_CIRCLE_PREFS_FOR_USER,
  GET_CIRCLES_BY_USER_ID,
} from "../../graphql/queries";

import { useQuery, useMutation } from "@apollo/client";

import SwitchLineWithQuery from "./SwitchLineWithQuery";
import Title from "../../components/Title";
import DisclaimerText from "../../components/DisclaimerText";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";

import GlowButton from "../../components/GlowButton";

function CircleSettings(props) {
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");

  const [loading, setLoading] = useState(false);

  const [deleteUserFromCircle] = useMutation(DELETE_USER_FROM_CIRCLE, {
    refetchQueries: [
      {
        query: GET_CIRCLES_BY_USER_ID,
        variables: {
          id: user,
        },
        skip: !user,
      },
    ],
  });

  const { loading: loadingQuery, error, data } = useQuery(
    GET_CIRCLE_PREFS_FOR_USER,
    {
      variables: {
        circle: props.route?.params?.circle,
        user: user,
      },
      skip: !user,
    }
  );

  // Update Title after loading data if we don't already have it
  useEffect(() => {
    if (
      data?.circlePermissionsList?.items[0]?.circle?.name &&
      !props.route.params.name
    ) {
      const thisCircleName =
        data?.circlePermissionsList?.items[0]?.circle?.name;

      props.navigation.setParams({ name: thisCircleName });
    }
  }, [data]);

  //  de/restructure circle permisssion
  let permissions = null;

  if (data?.circlePermissionsList) {
    permissions = data.circlePermissionsList.items[0];
  }

  useEffect(() => {
    if (!activeCircle && permissions) {
      setActiveCircle(props.route.params.circle);
    }
  }, []);

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

  if (!permissions) {
    return (
      <CenteredErrorLoader text={"You Don't Have Access to this Circle"} />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Title text={"Notification Preferences"} />
      <DisclaimerText
        text={
          "Set your communication preferences for this Circle. By default you will receive an email notification when a new revision is created, and when a revision has passed or been rejected."
        }
      />
      <SwitchLineWithQuery
        label={"Notify on New Revision"}
        id={permissions.id}
        pref={"onRevisions"}
        value={permissions.onRevisions}
      />
      {permissions.onRevisions && (
        <View style={{ paddingLeft: 15 }}>
          <SwitchLineWithQuery
            label={"Email"}
            id={permissions.id}
            pref={"revisionsEmail"}
            value={permissions.revisionsEmail}
          />
          <SwitchLineWithQuery
            label={"Push Notification"}
            id={permissions.id}
            pref={"revisionsPush"}
            value={permissions.revisionsPush}
          />
        </View>
      )}
      <View style={styles.break} />
      <SwitchLineWithQuery
        label={"Notify on New Amendment"}
        value={permissions.onAmendments}
        id={permissions.id}
        pref={"onAmendments"}
      />
      {permissions.onAmendments && (
        <View style={{ paddingLeft: 15 }}>
          <SwitchLineWithQuery
            label={"Email"}
            value={permissions.amendmentsEmail}
            id={permissions.id}
            pref={"amendmentsEmail"}
          />
          <SwitchLineWithQuery
            label={"Push Notification"}
            value={permissions.amendmentsPush}
            id={permissions.id}
            pref={"amendmentsPush"}
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
  break: {
    height: 20,
  },
});

export default CircleSettings;
