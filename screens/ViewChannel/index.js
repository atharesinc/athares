import React, { useState, useGlobal, useEffect, useRef } from "reactn";

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

import { CREATE_MESSAGE } from "../../graphql/mutations";
import { GET_MESSAGES_FROM_CHANNEL_ID } from "../../graphql/queries";
// import { SUB_TO_MESSAGES_BY_CHANNEL_ID } from "../../../graphql/subscriptions";
import { useQuery, useMutation } from "@apollo/react-hooks";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { processFile, uploadToAWS } from "../../utils/upload";

export default function ViewChannel(props) {
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [activeChannel] = useGlobal("activeChannel");
  const [user] = useGlobal("user");

  // remove this channel from unread channels list on mount
  const { loading, error, data } = useQuery(GET_MESSAGES_FROM_CHANNEL_ID, {
    variables: {
      id: activeChannel || "",
    },
  });

  const [createMessage] = useMutation(CREATE_MESSAGE);

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
        const preparedFile = processFile(finalImage);

        // get presigned upload link for this image
        let signedUploadUrl = await getSignedUrl({
          variables: {
            name: preparedFile.name,
            type: preparedFile.type,
          },
        });

        // upload file using our pre-approved AWS url
        let res = await uploadToAWS(
          signedUploadUrl.data.getSignedUrl.url,
          preparedFile
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
  let messages = [];
  let channel = null;

  // subscribe and populate
  if (data && data.channel) {
    channel = data.channel;
    messages = data.channel.messages.items;
    return (
      <View style={[styles.wrapper]}>
        <Chat user={user} messages={messages} />
        <ChatInput onSend={submit} uploadInProgress={uploadInProgress} />
        <KeyboardAvoidingView behavior="padding" />
        {Platform.OS === "android" ? (
          <KeyboardSpacer topSpacing={-130} />
        ) : null}
      </View>
    );
  } else {
    return <CenteredLoaderWithText text={"Getting Messages"} />;
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
  },
});
