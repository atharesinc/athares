import React, { useState, useGlobal, memo, useEffect, useRef } from "reactn";

import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";

import Chat from "../../components/Chat";
import ChatInput from "../../components/ChatInput";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";

import {
  CREATE_MESSAGE,
  CREATE_SIGNED_UPLOAD_LINK,
} from "../../graphql/mutations";
import { GET_MESSAGES_FROM_CHANNEL_ID } from "../../graphql/queries";
import { SUB_TO_MESSAGES_BY_CHANNEL_ID } from "../../graphql/subscriptions";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { uploadToAWS } from "../../utils/upload";
import MeshAlert from "../../utils/meshAlert";
import useImperativeQuery from "../../utils/useImperativeQuery";
import DisclaimerText from "../../components/DisclaimerText";
import useBelongsInCircle from "../../utils/useBelongsInCircle";

export default memo(function ViewChannel(props) {
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [activeChannel, setActiveChannel] = useGlobal("activeChannel");
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");

  const [user] = useGlobal("user");
  const [messages, setMessages] = useState([]);
  const hasOlderMessages = useRef(true);

  const [scrollState, setScrollState] = useState({
    isLoadingOlderMessages: false,
    scrollUps: 1,
  });

  // remove this channel from unread channels list on mount
  const { loading, error, data } = useQuery(GET_MESSAGES_FROM_CHANNEL_ID, {
    variables: {
      id: props.route.params.channel,
      skip: 0,
    },
  });

  const belongsToCircle = useBelongsInCircle({
    user: user || "",
    circle: activeCircle || "",
  });

  const getMoreMessagesQuery = useImperativeQuery(GET_MESSAGES_FROM_CHANNEL_ID);

  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [getSignedUrl] = useMutation(CREATE_SIGNED_UPLOAD_LINK);

  useSubscription(SUB_TO_MESSAGES_BY_CHANNEL_ID, {
    variables: { id: activeChannel || "" },
    onSubscriptionData,
  });

  function onSubscriptionData({ subscriptionData }) {
    if (subscriptionData.data) {
      // append the latest item to the list
      setMessages([...messages, subscriptionData.data.Messages.node]);
    }
  }

  useEffect(() => {
    if (activeCircle !== props.route.params.circle) {
      setActiveCircle(props.route.params.circle);
    }
    if (!activeChannel) {
      setActiveChannel(props.route.params.channel);
    }
  }, []);

  // Update Title after loading data if we don't already have it
  useEffect(() => {
    if (data && data.channel && !props.route.params.name) {
      const {
        channel: { name },
      } = data;
      props.navigation.setParams({ name });
    }
  }, [data]);

  //   removeUnreadChannel(chan) {
  //     let { unreadChannels } = this.global;
  //     if (unreadChannels.includes(chan)) {
  //       let index = unreadChannels.findIndex((d) => d === chan);
  //       if (index !== -1) {
  //         unreadChannels.splice(index, 1);
  //         unreadChannels = [...unreadChannels];
  //         this.setGlobal({
  //           unreadChannels,
  //         });
  //       }
  //     }
  //   }
  // componentDidUpdate(prevProps) {
  //   if (
  //     this.global.activeChannel &&
  //     this.global.activeChannel !== prevProps.activeChannel
  //   ) {
  //     this.removeUnreadChannel(this.global.activeChannel);
  //   }
  // }

  const submit = async (text = "", file = null) => {
    let url = null;
    try {
      if (file) {
        setUploadInProgress(true);
        // get file object
        // const preparedFile = processFile(file);

        // get presigned upload link for this image
        let signedUploadUrl = await getSignedUrl({
          variables: {
            name: file.name,
            type: file.type,
          },
        });

        // upload file using our pre-approved AWS url
        let res = await uploadToAWS(
          signedUploadUrl.data.getSignedUrl.url,
          file
        );

        // finally set the url we want to save to the db with our image
        url = res;
      }

      if (text.trim() === "" && !url) {
        return false;
      }
      let newMessage = {
        text: text.trim(),
        channel: activeChannel,
        user: user,
        file: url ? url : null,
      };
      await createMessage({
        variables: {
          ...newMessage,
        },
      });
    } catch (err) {
      console.error(new Error(err));
      MeshAlert({
        title: "Error",
        text: "We were unable to send your message, please try again later",
        icon: "error",
      });
    } finally {
      setUploadInProgress(false);
    }
  };

  useEffect(() => {
    if (data && data.channel) {
      setMessages(data.channel.messages.items);

      // don't let the user scroll back futher if the number of inital messages is less than 20
      hasOlderMessages.current = data.channel.messages.items.length === 20;
    }
  }, [data]);

  const getMoreMessages = async () => {
    // prevent subsequent fetch is in progress
    if (scrollState.isLoadingOlderMessages) {
      return;
    }

    try {
      // don't let the user scroll back futher if the number of inital messages is less than 20
      if (!hasOlderMessages.current) {
        return;
      }

      setScrollState((prevScrollState) => ({
        ...prevScrollState,
        isLoadingOlderMessages: true,
      }));

      let olderMessages = await getMoreMessagesQuery({
        id: activeChannel,
        skip: 20 * scrollState.scrollUps,
      });

      // if we've reached the end of the list, don't keep trying to update
      if (olderMessages.data.channel.messages.items.length < 20) {
        hasOlderMessages.current = false;
      }

      // update our cursor for getting new messages
      setScrollState((prevScrollState) => ({
        ...prevScrollState,
        isLoadingOlderMessages: false,
        scrollUps: prevScrollState.scrollUps + 1,
      }));

      // finally prepend our older messages to the end of the list
      setMessages((msgs) => [
        ...olderMessages.data.channel.messages.items,
        ...msgs,
      ]);
    } catch (e) {
      console.error(new Error(e));
      setScrollState((prevScrollState) => ({
        ...prevScrollState,
        isLoadingOlderMessages: false,
      }));
    }
  };

  if (error) {
    return <CenteredErrorLoader />;
  }

  if (loading || !data.channel) {
    return <CenteredLoaderWithText text={"Getting Messages"} />;
  }

  const offset =
    Platform.OS === "ios" ? 100 : Platform.OS === "android" ? 90 : 0;

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior="height"
      keyboardVerticalOffset={offset}
    >
      <Chat
        isLoadingOlderMessages={scrollState.isLoadingOlderMessages}
        user={user}
        messages={messages}
        getMoreMessages={getMoreMessages}
        channelName={data.channel.name}
      />
      {belongsToCircle ? (
        <ChatInput onSend={submit} uploadInProgress={uploadInProgress} />
      ) : (
        <View style={styles.notLoggedInWrapper}>
          <DisclaimerText>
            You are not a member of this Circle. Messages are not enabled.
          </DisclaimerText>
        </View>
      )}
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
    padding: 15,
  },
  notLoggedInWrapper: {
    backgroundColor: "#2f3242",
    minHeight: 50,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: 3,
  },
});
