import React, { Component } from "reactn";

class ChannelUpdateMonitor extends Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.getAllMyChannels.User &&
      this.props.getAllMyChannels.User !== prevProps.getAllMyChannels.User
    ) {
      let { circles } = this.props.getAllMyChannels.User;
      let channels = circles.map((c) => c.channels).flat(1);

      channels = channels.map((c) => c.id);
      // set the user's current channels
      this.setGlobal({ channels });
    }
  }
  _subToMore = (subscribeToMore) => {
    subscribeToMore({
      document: SUB_TO_ALL_CIRCLES_CHANNELS,
      variables: { ids: this.global.channels || [] },
      updateQuery: (prev, { subscriptionData }) => {
        let updatedChannel = subscriptionData.data.Message.node.channel.id;
        if (subscriptionData.data.Message.node.user.id === this.global.user) {
          return prev;
        }
        if (this.global.activeChannel !== updatedChannel) {
          if (
            this.global.channels.findIndex((ch) => ch === updatedChannel) !== -1
          ) {
            this.addUnreadChannel(updatedChannel);
          }
          return prev;
        }
      },
    });
  };
  addUnreadChannel = (chan) => {
    let { unreadChannels } = this.global;
    if (!unreadChannels.includes(chan)) {
      unreadChannels = [...unreadChannels, chan];
      this.setGlobal({
        unreadChannels: [...this.global.unreadChannels, updatedChannel],
      });
    }
  };

  render() {
    return null;
  }
}

export default ChannelUpdateMonitor;
