import React, { useRef, useEffect } from "reactn";
import { FlatList } from "react-native";
import Message from "./Message";
import CenteredLoaderWithText from "./CenteredLoaderWithText";

// import { insertBreaks } from "../utils/transform";

export default function Chat({ messages, getMoreMessages, ...props }) {
  const scrollRef = useRef();

  useEffect(() => {
    console.log(scrollRef.current);
  }, []);

  const _renderItem = ({ item, index }) => {
    const isSameDay =
      index === 0
        ? true
        : messages[index - 1].createdAt.substring(0, 10) !==
          item.createdAt.substring(0, 10);

    return (
      <Message
        isSameUser={
          isSameDay || index === 0
            ? false
            : messages[index - 1].user.id === messages[index].user.id
        }
        isSameDay={isSameDay}
        isMine={item.user.id === props.user}
        key={item.id}
        timestamp={item.createdAt}
        message={item}
      />
    );
  };

  const _keyExtractor = (item) => item.id;

  const shouldDisplayLoadingOlderMessages = props.isLoadingOlderMessages ? (
    <CenteredLoaderWithText text={"Getting Older Messages"} />
  ) : null;

  return (
    <FlatList
      ListHeaderComponent={shouldDisplayLoadingOlderMessages}
      onEndReachedThreshold={0.5}
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
