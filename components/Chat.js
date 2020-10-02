import React, { useRef, useEffect } from "reactn";
import { FlatList } from "react-native";
import Message from "./Message";
import MessageDivider from "./MessageDivider";

import { insertBreaks } from "../utils/transform";

export default function Chat({ messages, getMoreMessages, ...props }) {
  messages = insertBreaks(messages);
  const scrollRef = useRef();

  useEffect(() => {
    console.log(scrollRef.current);
  }, []);

  const _renderItem = ({ item, index }) =>
    item.date ? (
      <MessageDivider key={item.id} date={item.date} />
    ) : (
      <Message
        multiMsg={
          index < messages.length - 1 &&
          messages[index - 1].user.id === messages[index].user.id
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
      inverted={-1}
      data={messages}
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      contentContainerStyle={{
        paddingBottom: 40,
        flexDirection: "column-reverse",
      }}
      ref={scrollRef}
    />
  );
}
