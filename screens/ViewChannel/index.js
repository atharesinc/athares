import React, { useState, useGlobal, memo, useEffect } from "reactn";

import {
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
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
import KeyboardSpacer from "react-native-keyboard-spacer";
import { uploadToAWS } from "../../utils/upload";

export default memo(function ViewChannel() {
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [activeChannel] = useGlobal("activeChannel");
  const [user] = useGlobal("user");
  const [messages, setMessages] = useState([]);

  // remove this channel from unread channels list on mount
  const { loading, error, data } = useQuery(GET_MESSAGES_FROM_CHANNEL_ID, {
    variables: {
      id: activeChannel || "",
    },
  });

  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [getSignedUrl] = useMutation(CREATE_SIGNED_UPLOAD_LINK);

  useSubscription(SUB_TO_MESSAGES_BY_CHANNEL_ID, {
    variables: { id: activeChannel || "" },
    onSubscriptionData,
  });

  function onSubscriptionData({ subscriptionData }) {
    console.log("newMEssage", subscriptionData);
    if (subscriptionData.data) {
      // fire off query again  vs. just add the new value to candidates
      // refetch({
      //   id: user || "",
      // });

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
        console.log({ file });
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
      const res = await createMessage({
        variables: {
          ...newMessage,
        },
      });
      console.log({ res });
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
  //   _subToMore = (subscribeToMore) => {
  //     subscribeToMore({
  //       document: SUB_TO_MESSAGES_BY_CHANNEL_ID,
  //       variables: { id: this.props.activeChannel || "" },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         let newMsg = subscriptionData.data.Message.node;
  //         // merge new messages into prev.messages
  //         if (prev) {
  //           prev.Channel.messages = [...prev.Channel.messages, newMsg];
  //         }
  //         return prev;
  //       },
  //     });
  //   };

  useEffect(() => {
    if (data && data.channel) {
      setMessages(data.channel.messages.items);
    }
  }, [data]);

  if (loading) {
    return <CenteredLoaderWithText text={"Getting Messages"} />;
  }

  if (error) {
    return <CenteredErrorLoader />;
  }
  // subscribe and populate
  // if (messages) {
  // const channel = data.channel;
  // const messages = data.channel.messages.items;

  const getMoreMessages = (num) => {
    console.log("at the end", num);
  };

  return (
    <View style={[styles.wrapper]}>
      <Chat user={user} messages={messages} getMoreMessages={getMoreMessages} />
      <ChatInput onSend={submit} uploadInProgress={uploadInProgress} />
      <KeyboardAvoidingView behavior="padding" />
      {Platform.OS === "android" ? <KeyboardSpacer topSpacing={-130} /> : null}
    </View>
  );
  // } else {
  //   return <CenteredLoaderWithText text={"Getting Messages"} />;
  // }
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
