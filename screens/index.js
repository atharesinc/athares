import React, { useGlobal } from "reactn";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import Channels from "./Channels";
import News from "./News";
import CreateCircle from "./CreateCircle";
import CreateChannel from "./CreateChannel";
import ViewChannel from "./ViewChannel";
import Revisions from "./Revisions";
import Constitution from "./Constitution";
import Portal from "./Portal";
import CreateRevision from "./CreateRevision";
import ViewRevision from "./ViewRevision";
import EditAmendment from "./EditAmendment";
import CircleSettings from "./CircleSettings";
import AddUser from "./AddUser";
import ViewInvites from "./ViewInvites";
import ViewUser from "./Me";
import ViewOtherUser from "./ViewOtherUser";

import Splash from "./Splash";
import About from "./About";
// import Roadmap from "./Roadmap";
import Privacy from "./Privacy";
import NotFound from "./NotFound";

import Header from "../components/Header";
import { pushTransition } from "../navigation/transitionConfigs";

const Stack = createStackNavigator();

export default function RootStack() {
  const [isMobile] = useGlobal("isMobile");
  const [activeTheme] = useGlobal("activeTheme");

  const shouldDisplayNewsAsApp = isMobile ? Channels : News;
  const newsOptions = isMobile ? {} : { headerShown: false };
  const appOptions = { headerShown: false };
  return (
    <Stack.Navigator
      headerMode="screen"
      // props =  { scene, previous, navigation }
      screenOptions={{
        header: (props) => <Header {...props} />,
        ...pushTransition(activeTheme),
      }}
    >
      {/* This is where all the screens go */}
      {Platform.OS === "web" && (
        <>
          <Stack.Screen
            name="splash"
            component={Splash}
            options={{ title: "Athares" }}
          />
          {/* <Stack.Screen name="roadmap" component={Roadmap} /> */}
        </>
      )}
      <Stack.Screen
        name="app"
        component={shouldDisplayNewsAsApp}
        options={{ ...appOptions, title: "Athares" }}
      />
      <Stack.Screen name="portal" component={Portal} />

      <Stack.Screen
        name="createRevision"
        component={CreateRevision}
        options={({ route }) => ({
          title: "Create Revision in " + (route?.params?.name || "Circle"),
        })}
      />
      <Stack.Screen
        name="viewRevision"
        component={ViewRevision}
        options={({ route }) => ({
          title: "Viewing " + (route?.params?.name || "Revision"),
        })}
      />

      <Stack.Screen
        name="createCircle"
        component={CreateCircle}
        options={{
          title: "Create New Circle",
        }}
      />
      <Stack.Screen
        name="circleSettings"
        component={CircleSettings}
        options={({ route }) => ({
          title: "Settings for " + (route?.params?.name || "Circle"),
        })}
      />

      <Stack.Screen
        name="constitution"
        component={Constitution}
        options={({ route }) => ({
          title: (route?.params?.name || "") + " Constitution",
        })}
      />
      <Stack.Screen
        name="createChannel"
        component={CreateChannel}
        options={({ route }) => ({
          title: "Create Channel in " + (route?.params?.name || "Circle"),
        })}
      />
      <Stack.Screen
        name="channel"
        component={ViewChannel}
        options={({ route }) => ({
          title: route?.params?.name || "Channel",
        })}
      />
      <Stack.Screen
        name="news"
        component={News}
        options={({ route }) => ({
          ...newsOptions,
          title: (route?.params?.name || "Circle") + " News",
        })}
      />
      <Stack.Screen
        name="revisions"
        component={Revisions}
        options={({ route }) => ({
          title: (route?.params?.name || "") + " Revisions",
        })}
      />
      <Stack.Screen
        name="editAmendment"
        component={EditAmendment}
        options={({ route }) => ({
          title: "Editing " + (route?.params?.name || "Amendment"),
        })}
      />
      <Stack.Screen
        name="addUser"
        component={AddUser}
        options={({ route }) => ({
          title: "Invite to " + (route?.params?.name || "Circle"),
        })}
      />
      <Stack.Screen
        name="viewInvites"
        component={ViewInvites}
        options={{ title: "My Invites" }}
      />
      <Stack.Screen
        name="viewUser"
        component={ViewUser}
        options={{ title: "My Profile" }}
      />
      <Stack.Screen
        name="viewOtherUser"
        component={ViewOtherUser}
        options={({ route }) => ({
          title: route?.params?.name || "Other User",
        })}
      />
      <Stack.Screen
        name="privacy"
        component={Privacy}
        options={{ title: "Privacy Policy" }}
      />
      <Stack.Screen
        name="notFound"
        component={NotFound}
        options={{ title: "404" }}
      />
      <Stack.Screen
        name="about"
        component={About}
        options={{ title: "About Athares" }}
      />
    </Stack.Navigator>
  );
}
