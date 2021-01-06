import { useEffect, useGlobal } from "reactn";
import NetInfo from "@react-native-community/netinfo";

export default function OnlineMonitor() {
  const [, setIsOnline] = useGlobal("isOnline");
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
}
