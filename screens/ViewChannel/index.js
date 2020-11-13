import React, { useState, useGlobal, memo, useEffect, useRef } from "reactn";

import {
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

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
import useImperativeQuery from "../../utils/useImperativeQuery";

export default memo(function ViewChannel(props) {
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [activeChannel] = useGlobal("activeChannel");
  const [user] = useGlobal("user");
  const [messages, setMessages] = useState([]);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [scrollUps, setScrollUps] = useState(1);
  const hasOlderMessages = useRef(true);

  // remove this channel from unread channels list on mount
  const { loading, error, data } = useQuery(GET_MESSAGES_FROM_CHANNEL_ID, {
    variables: {
      id: props.route.params.channel,
      skip: 0,
    },
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
      Alert.alert(
        "Error",
        "We were unable to send your message, please try again later"
      );
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

  // after we get the older messages, get rid of the older messages loader
  useEffect(() => {
    setIsLoadingOlderMessages(false);
  }, [messages]);

  const getMoreMessages = async () => {
    // don't let the user scroll back futher if the number of inital messages is less than 20
    if (!hasOlderMessages.current) {
      return;
    }

    setIsLoadingOlderMessages(true);
    let olderMessages = await getMoreMessagesQuery({
      id: activeChannel,
      skip: 20 * scrollUps,
    });

    // if we've reached the end of the list, don't keep trying to update
    if (olderMessages.data.channel.messages.items.length < 20) {
      hasOlderMessages.current = false;
    }

    // update our cursor for getting new messages
    setScrollUps((num) => num + 1);

    // finally prepend our older messages to the end of the list
    setMessages((msgs) => [
      ...olderMessages.data.channel.messages.items,
      ...msgs,
    ]);
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
        isLoadingOlderMessages={isLoadingOlderMessages}
        user={user}
        messages={messages}
        getMoreMessages={getMoreMessages}
        channelName={data.channel.name}
      />
      <ChatInput onSend={submit} uploadInProgress={uploadInProgress} />
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
});
