import React, { useGlobal, Fragment } from "reactn";

import { ScrollView, View, Text } from "react-native";
import Footer from "./Footer";
import Circles from "../../components/Circles";
import ChannelItem from "../../components/ChannelItem";
import ChannelGroupHeader from "./ChannelGroupHeader";
import GovernanceChannelItem from "./GovernanceChannelItem";
import CircleTitle from "./CircleTitle";

import Header from "../../components/Header";
import { Search } from "./Search";
import {
  IS_USER_IN_CIRCLE,
  GET_CHANNELS_BY_CIRCLE_ID,
} from "../../graphql/queries";
import { useQuery } from "@apollo/client";

function Dashboard({ renderAsSidebar = false, ...props }) {
  const [activeCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");
  const [unreadDMs] = useGlobal("unreadDMs");
  const [unreadChannels] = useGlobal("unreadChannels");
  const [showSearch] = useGlobal("showSearch");

  let circle = null;
  let channels = [];
  let belongsToCircle = false;

  // get channel data, if any
  const { loading: loading1, error: e1, data: channelsData } = useQuery(
    GET_CHANNELS_BY_CIRCLE_ID,
    {
      variables: {
        id: activeCircle || "",
      },
    }
  );

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
  const { loading: loading2, error: e2, data: belongsToCircleData } = useQuery(
    IS_USER_IN_CIRCLE,
    {
      variables: {
        circle: activeCircle || "",
        user: user || "",
      },
    }
  );

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
    ? {
        flex: 0,
        flexGrow: 1 / 3,
        backgroundColor: "#fff",
        flexDirection: "column",
        minWidth: 300,
      }
    : {
        alignItems: "stretch",
        justifyContent: "space-between",
        width: "100%",
        flex: 1,
        backgroundColor: "#282a38",
      };

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
            />

            {channels.map((ch) => (
              <ChannelItem key={ch.id} showUnread={ch.unread} channel={ch} />
            ))}
          </Fragment>
        ) : (
          <View style={{ marginTop: 20 }}>
            <CircleTitle title={"Welcome to Athares"} />
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
