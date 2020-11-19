import React, { useGlobal, Fragment } from "reactn";

import { ScrollView, View, StyleSheet } from "react-native";
import Footer from "./Footer";
import Circles from "../../components/Circles";
import ChannelItem from "../../components/ChannelItem";
import ChannelGroupHeader from "../../components/ChannelGroupHeader";
import GovernanceChannelItem from "./GovernanceChannelItem";
import CircleTitle from "./CircleTitle";
import DisclaimerText from "../../components/DisclaimerText";
import Header from "../../components/Header";
import { Search } from "./Search";
import {
  IS_USER_IN_CIRCLE,
  GET_CHANNELS_BY_CIRCLE_ID,
} from "../../graphql/queries";
import { SUB_TO_CIRCLES_CHANNELS } from "../../graphql/subscriptions";

import { useQuery, useSubscription } from "@apollo/client";
import * as RootNavigation from "../../navigation/RootNavigation";

function Dashboard({ renderAsSidebar = false }) {
  const [activeCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");
  const [unreadChannels] = useGlobal("unreadChannels");
  const [showSearch] = useGlobal("showSearch");
  const [, setActiveChannel] = useGlobal("activeChannel");
  let circle = null;
  let channels = [];
  let belongsToCircle = false;

  // get channel data, if any
  const {
    // loading: loading1,
    // error: e1,
    data: channelsData,
    refetch,
  } = useQuery(GET_CHANNELS_BY_CIRCLE_ID, {
    variables: {
      id: activeCircle || "",
    },
  });

  useSubscription(SUB_TO_CIRCLES_CHANNELS, {
    variables: { id: activeCircle || "" },
    onSubscriptionData,
  });

  const goToCreateChannel = () => {
    setActiveChannel(null, () => {
      RootNavigation.navigate("createChannel", { circle: activeCircle });
    });
  };

  function onSubscriptionData({ subscriptionData }) {
    if (subscriptionData.data) {
      // fire off query again  vs. just add the new value to candidates
      refetch({
        id: activeCircle || "",
      });
    }
  }

  if (channelsData) {
    // _subToMore(subscribeToMore);
    circle = channelsData.circle;
    channels = circle.channels.items;
    channels = channels.map((ch) => ({
      unread: unreadChannels.includes(ch.id),
      ...ch,
    }));
  }

  // see if the user actually belongs to this circle
  const {
    // loading: loading2,
    // error: e2,
    data: belongsToCircleData,
  } = useQuery(IS_USER_IN_CIRCLE, {
    variables: {
      circle: activeCircle || "",
      user: user || "",
    },
  });

  if (
    belongsToCircleData &&
    belongsToCircleData.circlesList &&
    belongsToCircleData.circlesList.items.length !== 0 &&
    belongsToCircleData.circlesList.items[0].id === activeCircle
  ) {
    belongsToCircle = true;
  }

  // responsive styles for channels component, which can either render on the side or as a full-screen mobile component
  const wrapperStyles = renderAsSidebar
    ? styles.desktopSidebar
    : styles.mobileSidebar;

  return (
    <View style={wrapperStyles}>
      <Header scene={{ route: { name: "" } }} />
      {showSearch ? <Search /> : null}
      <Circles loggedIn={user} />
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "#282a38",
          flexGrow: 1,
        }}
      >
        {circle ? (
          <Fragment>
            <CircleTitle
              belongsToCircle={belongsToCircle}
              title={circle.name}
            />
            <ChannelGroupHeader title={"GOVERNANCE"} />
            <GovernanceChannelItem
              title={"Constitution"}
              link={"constitution"}
            />
            <GovernanceChannelItem title={"Polls"} link={"revisions"} />
            <GovernanceChannelItem title={"News"} link={"news"} />

            <ChannelGroupHeader
              title={"CHANNELS"}
              displayPlus={user && belongsToCircle}
              onPressPlus={goToCreateChannel}
            />

            {channels.map((ch) => (
              <ChannelItem key={ch.id} showUnread={ch.unread} channel={ch} />
            ))}
          </Fragment>
        ) : (
          <View style={{ marginTop: 20 }}>
            <CircleTitle title={"Welcome to Athares"} />
            <DisclaimerText
              grey
              text={
                "Login or Register to access your Circles, or search for using the search icon at the top."
              }
              style={{ marginHorizontal: 15 }}
            />
          </View>
        )}
        {/* <ChannelGroupHeader title={"DIRECT MESSAGES"} displayPlus={true} />
        {dms.map((ch) => (
          <ChannelItem key={ch.id} showUnread={ch.unread} channel={ch} />
        ))} */}
      </ScrollView>
      <Footer loggedIn={user} belongsToCircle={belongsToCircle} />
    </View>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  desktopSidebar: {
    flex: 0,
    flexGrow: 1 / 3,
    backgroundColor: "#fff",
    flexDirection: "column",
    minWidth: 300,
  },
  mobileSidebar: {
    alignItems: "stretch",
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
    backgroundColor: "#282a38",
  },
});
