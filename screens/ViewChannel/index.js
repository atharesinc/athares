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
// import { uploadImage, uploadDocument } from "../../../utils/upload";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Loader from "../../components/Loader";

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
    // let response = null;
    // try {
    //   if (file) {
    //     setUploadInProgress( true)
    //     const imgs = ["gif", "png", "jpg", "jpeg", "bmp"];
    //     let extension = file.name.match(/\.(.{1,4})$/i);
    //     if (imgs.indexOf(extension[1].toLowerCase()) !== -1) {
    //       response = await uploadImage(file);
    //     } else {
    //       response = await uploadDocument(file);
    //     }
    //   }
    //   if (response) {
    //     if (response.error) {
    //       console.error(new Error(response.error));
    //       return false;
    //     }
    //   }
    //   if (text.trim() === "" && !response.url) {
    //     return false;
    //   }
    //   let newMessage = {
    //     text: text.trim(),
    //     channel: this.props.activeChannel,
    //     user: this.props.user,
    //     file: response ? response.url : null,
    //     fileName: response ? response.name : null,
    //   };
    //   await this.props.createMessage({
    //     variables: {
    //       ...newMessage,
    //     },
    //   });
    //   this.setState({
    //     uploadInProgress: false,
    //   });
    // } catch (err) {
    //   this.setState({
    //     uploadInProgress: false,
    //   });
    //   console.error(new Error(err));
    //   Alert.alert(
    //     "Error",
    //     "We were unable to send your message, please try again later"
    //   );
    // }
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
