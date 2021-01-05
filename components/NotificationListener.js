import { memo, useEffect, useRef, useGlobal } from "reactn";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";
import { GET_USER_EXPO_TOKEN, GET_USER_ALLOW_PUSH } from "../graphql/queries";
import { UPDATE_USER_EXPO_TOKEN } from "../graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import * as RootNavigation from "../navigation/RootNavigation";

export default memo(function NotificationListener({ user = "" }) {
  const [, setToken] = useGlobal("token");
  const notificationListener = useRef();
  const responseListener = useRef();

  const { data } = useQuery(GET_USER_EXPO_TOKEN, {
    variables: {
      id: user,
    },
  });

  const { data: allowPush } = useQuery(GET_USER_ALLOW_PUSH, {
    variables: {
      id: user,
    },
  });

  const [updateToken] = useMutation(UPDATE_USER_EXPO_TOKEN);
  useEffect(() => {
    // only request permissions and register token if they've ever enabled notifications for any circle
    if (allowPush?.user?.circlePermissions?.count > 0) {
      registerForPushNotificationsAsync()
        .then(async (thisToken) => {
          // if the token already exists in the user's pushToken array, set it and forget it,
          //  otherwise add it to our cadre
          if (
            data?.user?.pushTokens?.items.findIndex(
              ({ token }) => token === thisToken
            ) === -1
          ) {
            await updateToken({ variables: { id: user, token: thisToken } });
          }

          setToken(thisToken);
        })
        .catch(console.error);
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const {
          data: { path, params },
        } = notification.request.content;
        // data => {path : "viewRevision", params: {circle: "...", "revision": "..."}}
        RootNavigation.navigate(path, params);

        let count = await Notifications.getBadgeCountAsync();

        Notifications.setBadgeCountAsync(count + 1);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const {
          data: { path, params },
        } = response.notification.request.content;
        // data => {path : "viewRevision", params: {circle: "...", "revision": "..."}}
        RootNavigation.navigate(path, params);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [data, allowPush]);

  return null;
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.error("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#00DFFC",
    });
  }

  return token;
}
