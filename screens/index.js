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
          <Stack.Screen name="splash" component={Splash} />
          {/* <Stack.Screen name="roadmap" component={Roadmap} /> */}
        </>
      )}
      <Stack.Screen
        name="app"
        component={shouldDisplayNewsAsApp}
        options={appOptions}
      />
      <Stack.Screen
        name="portal"
        component={Portal}
        // options={{ headerShown: false }}
      />

      <Stack.Screen name="createRevision" component={CreateRevision} />
      <Stack.Screen name="viewRevision" component={ViewRevision} />

      <Stack.Screen name="createCircle" component={CreateCircle} />
      <Stack.Screen name="circleSettings" component={CircleSettings} />

      <Stack.Screen name="constitution" component={Constitution} />
      <Stack.Screen name="createChannel" component={CreateChannel} />
      <Stack.Screen name="channel" component={ViewChannel} />
      <Stack.Screen name="news" component={News} options={newsOptions} />
      <Stack.Screen name="revisions" component={Revisions} />
      <Stack.Screen name="editAmendment" component={EditAmendment} />
      <Stack.Screen name="addUser" component={AddUser} />
      <Stack.Screen name="viewInvites" component={ViewInvites} />
      <Stack.Screen name="viewUser" component={ViewUser} />
      <Stack.Screen name="viewOtherUser" component={ViewOtherUser} />
      <Stack.Screen name="privacy" component={Privacy} />
      <Stack.Screen name="notFound" component={NotFound} />
      <Stack.Screen name="about" component={About} />
    </Stack.Navigator>
  );
}
