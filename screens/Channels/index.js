import React, { withGlobal, Fragment } from "reactn";

import { ScrollView, View, Text } from "react-native";
import Footer from "../../components/Footer";
import Circles from "../../components/Circles";
import ChannelItem from "../../components/ChannelItem";
import ChannelGroupHeader from "../../components/ChannelGroupHeader";
import CircleHeader from "../../components/CircleHeader";
import GovernanceChannelItem from "../../components/GovernanceChannelItem";
import Header from "../../components/Header";

import { Search } from "./Search";

function Dashboard({
  activeCircle,
  unreadDMs,
  unreadChannels,
  showSearch,
  renderAsSidebar = false,
  ...props
}) {
  let belongsToCircle = false;
  let user = null;
  let circle = null;
  let channels = [];
  let dms = [];

  // get channel data, if any

  // see if the user actually belongs to this circle

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
        {circle && (
          <Fragment>
            <ChannelGroupHeader title={"GOVERNANCE"} />
            <GovernanceChannelItem
              title={"Constitution"}
              link={"Constitution"}
            />
            <GovernanceChannelItem title={"Polls"} link={"Revisions"} />
            {user && belongsToCircle && (
              <GovernanceChannelItem
                title={"Settings"}
                link={"CircleSettings"}
              />
            )}
            <ChannelGroupHeader
              title={"CHANNELS"}
              displayPlus={user && belongsToCircle}
            />

            {channels.map((ch) => (
              <ChannelItem key={ch.id} showUnread={ch.unread} channel={ch} />
            ))}
          </Fragment>
        )}
        <ChannelGroupHeader title={"DIRECT MESSAGES"} displayPlus={true} />
        {dms.map((ch) => (
          <ChannelItem key={ch.id} showUnread={ch.unread} channel={ch} />
        ))}
      </ScrollView>
      <Footer loggedIn={user} belongsToCircle={belongsToCircle} />
    </View>
  );
}

export default withGlobal(
  ({ activeCircle, user, unreadDMs, unreadChannels, showSearch }) => ({
    activeCircle,
    user,
    unreadDMs,
    unreadChannels,
    showSearch,
  })
)(Dashboard);
