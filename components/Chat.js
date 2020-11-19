import React, { useRef, memo } from "reactn";
import { FlatList, StyleSheet, View } from "react-native";
import Message from "./Message";
import Loader from "./Loader";
import DisclaimerText from "./DisclaimerText";

export default memo(function Chat({
  messages,
  getMoreMessages,
  channelName,
  ...props
}) {
  const scrollRef = useRef();
  const heights = useRef([]);

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
        onLayout={onLayout}
        index={index}
      />
    );
  };
  const onLayout = (event) => {
    // event also has id and index
    // event.nativeEvent.layout has height and width
    heights.current[event.index] = event.nativeEvent.layout.height;
  };

  const getItemLayout = (_, index) => {
    if (!heights.current[index]) {
      // return temp object
      return {
        length: 38,
        offset: 38 * index,
        index,
      };
    }

    return {
      length: heights.current[index],
      offset:
        heights.current.reduce((acc, dim) => acc + dim) -
        heights.current[index],
      index,
    };
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
      onEndReachedThreshold={0.1}
      onEndReached={getMoreMessages}
      inverted={-1}
      data={messages}
      renderItem={_renderItem}
      keyExtractor={_keyExtractor}
      contentContainerStyle={styles.contentContainerStyle}
      removeClippedSubviews={true}
      ref={scrollRef}
      getItemLayout={getItemLayout}
      scrollEventThrottle={1000}
      // initialScrollIndex={messages.length > 1 ? messages.length - 1 : 0}
      // onScrollToIndexFailed={scrollFailed}
    />
  );
});

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 40,
    flexDirection: "column-reverse",
  },
});

// EITHER
// ListHeaderComponent
// inverted={-1}
// data={messages}
// flexDirection: "column-reverse",

// OR
// ListFooterComponent
// inverted={true}
// data={[...messages].reverse()}
// and find some way to re-unfuck logic for isSameDay
