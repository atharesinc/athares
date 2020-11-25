import React from "reactn";
import { ScrollView, Keyboard } from "react-native";
import SearchSection from "./SearchSection";

export default function SearchResults({
  searchParams,
  circlesList: circles,
  channelsList: channels,
  amendmentsList: amendments,
  revisionsList: revisions,
  usersList: users,
}) {
  circles = circles ? circles.items : [];
  channels = channels ? channels.items : [];
  amendments = amendments ? amendments.items : [];
  revisions = revisions ? revisions.items : [];
  users = users ? users.items : [];

  return (
    <ScrollView
      onScrollBeginDrag={Keyboard.dismiss}
      keyboardShouldPersistTaps={"awlays"}
    >
      {circles.length > 0 && (
        <SearchSection
          search={searchParams}
          data={circles}
          searchOn={"name"}
          title="circles"
        />
      )}
      {channels.length > 0 && (
        <SearchSection
          search={searchParams}
          data={channels}
          searchOn={"name"}
          title="channels"
        />
      )}
      {amendments.length > 0 && (
        <SearchSection
          search={searchParams}
          data={amendments}
          searchOn={"title"}
          title="amendments"
        />
      )}
      {revisions.length > 0 && (
        <SearchSection
          search={searchParams}
          data={revisions}
          searchOn={"title"}
          title="revisions"
        />
      )}
      {users.length > 0 && (
        <SearchSection
          search={searchParams}
          data={users}
          searchOn={"firstName"}
          title="users"
        />
      )}
    </ScrollView>
  );
}
