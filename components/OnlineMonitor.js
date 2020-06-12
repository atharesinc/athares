import { Component } from "reactn";
import * as Network from "expo-network";

/*
  There's a very specific reason this component is a class component:
  In a functional component, we would just use `const [isOnline, setIsOnline] = useGlobal('isOnline')`
  But for some reason (possibly because nothing is rendered?), isOnline never updates, so isOnline is always true
  In this class component, we're grabbing the value from this.global in each interval so it's up-to-date
*/

export default class OnlineMonitor extends Component {
  constructor() {
    super();

    this.interval = null;
  }
  componentDidMount() {
    this.interval = setInterval(async () => {
      // on iOS isInternetReachable will always be the same as isConnected
      // https://docs.expo.io/versions/latest/sdk/network/
      try {
        const {
          isConnected,
          isInternetReachable,
        } = await Network.getNetworkStateAsync();

        const connected = isConnected && isInternetReachable;
        // only update if different and after the initial load
        if (this.global.isOnline !== connected) {
          // console.log("Network connection changed");
          this.setGlobal({ isOnline: connected });
        }
      } catch (e) {
        console.error(e);
      }
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return null;
  }
}
