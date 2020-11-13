import React, { useRef, memo } from "reactn";
import { FlatList, View } from "react-native";
import Message from "./Message";
import Loader from "./Loader";
import DisclaimerText from "./DisclaimerText";

// import { insertBreaks } from "../utils/transform";

export default memo(function Chat({
  messages,
  getMoreMessages,
  channelName,
  ...props
}) {
  const scrollRef = useRef();

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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader size={25} />
      <DisclaimerText
        grey
        text={"Updating..."}
        style={{ marginBottom: 0, marginLeft: 5 }}
      />
    </View>
  ) : (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DisclaimerText
        grey
        text={"This is the beginning of history for " + channelName}
        style={{ marginBottom: 0 }}
      />
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={shouldDisplayLoadingOlderMessages}
      onEndReachedThreshold={0.9}
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
});
