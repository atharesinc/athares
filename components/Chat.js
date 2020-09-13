import React from "reactn";
import { FlatList } from "react-native";
import Message from "./Message";

export default function Chat({ messages, getMoreMessages, ...props }) {
  const _renderItem = ({ item, index }) => (
    <Message
      multiMsg={
        index < messages.length - 1 &&
        messages[index + 1].user.id === messages[index].user.id
      }
      isMine={item.user.id === props.user}
      key={item.id}
      timestamp={item.createdAt}
      message={item}
    />
  );

  const _keyExtractor = (item) => item.id;

  return (
    <FlatList
      onEndReached={getMoreMessages}
      inverted
      data={messages}
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
}
