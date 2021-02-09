import React, { useGlobal, lazy, Suspense, useMemo } from "reactn";
import { Platform } from "react-native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import Header from "../components/Header";
import { pushTransition } from "../navigation/transitionConfigs";

// Routes and components we always want to be able to load
import NotFound from "./NotFound";
import Channels from "./Channels";
import CenteredLoaderWithText from "../components/CenteredLoaderWithText";
import News from "./News";
import Menu from "../components/Menu";

const CreateCircle = lazy(() => import("./CreateCircle"));
const CreateChannel = lazy(() => import("./CreateChannel"));
const ViewChannel = lazy(() => import("./ViewChannel"));
const Revisions = lazy(() => import("./Revisions"));
const Constitution = lazy(() => import("./Constitution"));
const Portal = lazy(() => import("./Portal"));
const CreateRevision = lazy(() => import("./CreateRevision"));
const ViewRevision = lazy(() => import("./ViewRevision"));
const EditAmendment = lazy(() => import("./EditAmendment"));
const CircleSettings = lazy(() => import("./CircleSettings"));
const AddUser = lazy(() => import("./AddUser"));
const ViewInvites = lazy(() => import("./ViewInvites"));
const ViewUser = lazy(() => import("./Me"));
const ViewOtherUser = lazy(() => import("./ViewOtherUser"));

const Splash = lazy(() => import("./Splash"));
const About = lazy(() => import("./About"));
// import Roadmap from "./Roadmap";
const Privacy = lazy(() => import("./Privacy"));

const Stack = createStackNavigator();

export default function RootStack() {
  const [isMobile] = useGlobal("isMobile");
  const [activeTheme] = useGlobal("activeTheme");

  const shouldDisplayNewsAsApp = isMobile ? Channels : News;
  const newsOptions = isMobile ? {} : { headerShown: false };
  const appOptions = { headerShown: false };
  const screenOptions = useMemo(
    () => ({
      header: (props) => <Header {...props} />,
      ...pushTransition(activeTheme),
    }),
    []
  );
  return (
    <Stack.Navigator
      headerMode="screen"
      // props =  { scene, previous, navigation }
      screenOptions={screenOptions}
    >
      {/* This is where all the screens go */}
      {Platform.OS === "web" && (
        <>
          <Stack.Screen name="splash" options={{ title: "Athares" }}>
            {(props) => (
              <Suspense fallback={<CenteredLoaderWithText />}>
                <Splash {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          {/* <Stack.Screen name="roadmap" component={Roadmap} /> */}
        </>
      )}
      <Stack.Screen
        name="app"
        component={shouldDisplayNewsAsApp}
        options={{ ...appOptions, title: "Athares" }}
      />
      <Stack.Screen
        name="settings"
        component={Menu}
        options={({ route, navigation }) => ({
          title: "Settings",
          animationEnabled: true,
          headerShown: isMobile,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          headerStatusBarHeight:
            navigation
              .dangerouslyGetState()
              .routes.findIndex((r) => r.key === route.key) > 0
              ? 0
              : undefined,
          ...TransitionPresets.ModalPresentationIOS,
        })}
      />

      <Stack.Screen name="portal">
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <Portal {...props} />
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="createRevision"
        options={({ route }) => ({
          title: "Create Revision in " + (route?.params?.name || "Circle"),
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <CreateRevision {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="viewRevision"
        options={({ route }) => ({
          title: "Viewing " + (route?.params?.name || "Revision"),
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <ViewRevision {...props} />
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="createCircle"
        options={{
          title: "Create New Circle",
        }}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <CreateCircle {...props} />
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="circleSettings"
        options={({ route }) => ({
          title: "Settings for " + (route?.params?.name || "Circle"),
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <CircleSettings {...props} />
          </Suspense>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="constitution"
        options={({ route }) => ({
          title: (route?.params?.name || "") + " Constitution",
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <Constitution {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="createChannel"
        options={({ route }) => ({
          title: "Create Channel in " + (route?.params?.name || "Circle"),
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <CreateChannel {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="channel"
        options={({ route }) => ({
          title: route?.params?.name || "Channel",
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <ViewChannel {...props} />
          </Suspense>
        )}
      </Stack.Screen>
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
        options={({ route }) => ({
          title: (route?.params?.name || "") + " Revisions",
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <Revisions {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="editAmendment"
        options={({ route }) => ({
          title: "Editing " + (route?.params?.name || "Amendment"),
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <EditAmendment {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="addUser"
        options={({ route }) => ({
          title: "Invite to " + (route?.params?.name || "Circle"),
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <AddUser {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="viewInvites" options={{ title: "My Invites" }}>
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <ViewInvites {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="viewUser" options={{ title: "My Profile" }}>
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <ViewUser {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="viewOtherUser"
        options={({ route }) => ({
          title: route?.params?.name || "Other User",
        })}
      >
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <ViewOtherUser {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="privacy" options={{ title: "Privacy Policy" }}>
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <Privacy {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen name="about" options={{ title: "About Athares" }}>
        {(props) => (
          <Suspense fallback={<CenteredLoaderWithText />}>
            <About {...props} />
          </Suspense>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="notFound"
        component={NotFound}
        options={{ title: "404" }}
      />
    </Stack.Navigator>
  );
}
