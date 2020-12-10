import { memo, useState, useEffect, useRef } from "reactn";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";
import { GET_USER_EXPO_TOKEN } from "../graphql/queries";
import { UPDATE_USER_EXPO_TOKEN } from "../graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default memo(function NotificationListener({ user = "" }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const { data, loading, error } = useQuery(GET_USER_EXPO_TOKEN, {
    variables: {
      id: user || "",
    },
  });

  const [updateToken] = useMutation(UPDATE_USER_EXPO_TOKEN);

  useEffect(() => {
    // If the user doesn't have a token, and not because of loading, or an error
    // Get a new one
    if (!data && !loading && !error) {
      registerForPushNotificationsAsync()
        .then(async (token) => {
          await updateToken({ variables: { id: user, token } });
          setExpoPushToken(token);
        })
        .catch(console.error);
    }

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [data]);

  console.log(`Your expo push token: ${expoPushToken}`);
  console.log(notification && notification.request.content.title);
  console.log(notification && notification.request.content.body);
  console.log(
    notification && JSON.stringify(notification.request.content.data)
  );

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
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
