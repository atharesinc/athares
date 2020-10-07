import { useGlobal, useEffect, memo } from "reactn";
import { useSubscription, useQuery } from "@apollo/client";

import { GET_ALL_USERS_CIRCLES_CHANNELS } from "../graphql/queries";
import { SUB_TO_ALL_CIRCLES_CHANNELS } from "../graphql/subscriptions";

export default memo(function ChannelUpdateMonitor() {
  const [channels, setChannels] = useGlobal("channels");
  const [unreadChannels, setUnreadChannels] = useGlobal("unreadChannels");
  const [activeChannel] = useGlobal("activeChannel");
  const [user] = useGlobal("user");

  const { data } = useQuery(GET_ALL_USERS_CIRCLES_CHANNELS, {
    variables: {
      id: user || "",
    },
  });

  // set the user's current channels
  useEffect(() => {
    if (data && data.user) {
      let circles = data.user.circles.items;
      let flattenedChannels = circles.map((c) => c.channels.items).flat(1);

      flattenedChannels = flattenedChannels.map((c) => c.id);

      setChannels(flattenedChannels);
    }
  }, [data, setChannels]);

  useSubscription(SUB_TO_ALL_CIRCLES_CHANNELS, {
    variables: { ids: channels || [] },
    onSubscriptionData,
  });

  function onSubscriptionData({ subscriptionData }) {
    if (subscriptionData.data) {
      let updatedChannel = subscriptionData.data.Messages.node.channel.id;

      if (activeChannel !== updatedChannel) {
        if (channels.findIndex((ch) => ch === updatedChannel) !== -1) {
          setUnreadChannels([...unreadChannels, updatedChannel]);
        }
      }
    }
  }

  // componentDidUpdate(prevProps) {
  //     if (
  //         this.props.getAllMyChannels.User &&
  //         this.props.getAllMyChannels.User !== prevProps.getAllMyChannels.User
  //     ) {
  //         let { circles } = this.props.getAllMyChannels.User;
  //         let channels = circles.map((c) => c.channels).flat(1);

  //         channels = channels.map((c) => c.id);
  //         // set the user's current channels
  //         this.setGlobal({ channels });
  //     }
  // }
  // _subToMore(subscribeToMore) {
  //     subscribeToMore({
  //         document: SUB_TO_ALL_CIRCLES_CHANNELS,
  //         variables: { ids: this.global.channels || [] },
  //         updateQuery: (prev, { subscriptionData }) => {
  //             let updatedChannel =
  //                 subscriptionData.data.Message.node.channel.id;
  //             if (
  //                 subscriptionData.data.Message.node.user.id ===
  //                 this.global.user
  //             ) {
  //                 return prev;
  //             }
  //             if (this.global.activeChannel !== updatedChannel) {
  //                 if (
  //                     this.global.channels.findIndex(
  //                         (ch) => ch === updatedChannel
  //                     ) !== -1
  //                 ) {
  //                     this.addUnreadChannel(updatedChannel);
  //                 }
  //                 return prev;
  //             }
  //         },
  //     });
  // }
  // addUnreadChannel(chan) {
  //     // let { unreadChannels } = this.global;
  //     // if (!unreadChannels.includes(chan)) {
  //     //   unreadChannels = [...unreadChannels, chan];
  //     //   this.setGlobal({
  //     //     unreadChannels: [...this.global.unreadChannels, updatedChannel],
  //     //   });
  //     // }
  // }

  return null;
});
