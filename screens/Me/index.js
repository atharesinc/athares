import React, { useGlobal } from "reactn";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import debounce from "lodash.debounce";

import AvatarPicker from "../../components/AvatarPicker";
import InfoLine from "../../components/InfoLine";
import Title from "../../components/Title";
import Statistic from "../../components/Statistic";
import SwitchLine from "../../components/SwitchLine";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import {
  UPDATE_ALLOW_MARKETING_EMAIL,
  UPDATE_USER,
  CREATE_SIGNED_UPLOAD_LINK,
} from "../../graphql/mutations";
import { GET_USER_WITH_PREF_BY_ID } from "../../graphql/queries";
import { useQuery, useMutation } from "@apollo/client";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";
import { processFile, uploadToAWS } from "../../utils/upload";
import DisclaimerText from "../../components/DisclaimerText";

export default function Me() {
  const [user] = useGlobal("user");
  const [isMobile] = useGlobal("isMobile");

  const { data, loading, error } = useQuery(GET_USER_WITH_PREF_BY_ID, {
    variables: {
      id: user || "",
    },
  });

  const [updateMarketingEmail] = useMutation(UPDATE_ALLOW_MARKETING_EMAIL);
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const [getSignedUrl] = useMutation(CREATE_SIGNED_UPLOAD_LINK);

  const updatePref = async (checked) => {
    let { id } = data.user.prefs;

    await updateMarketingEmail({
      variables: {
        id,
        flag: checked,
      },
    });
  };

  const updateURI = async (uri) => {
    if (uri !== data.user.icon) {
      let finalImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 200, height: 200 } }],
        { format: "png", compress: 0.5 }
      );
      // finalImage = "data:image/png;base64," + finalImage.base64;

      // get file object
      const preparedFile = processFile(finalImage);

      // get presigned upload link for this image
      let signedUploadUrl = await getSignedUrl({
        variables: {
          name: preparedFile.name,
          type: preparedFile.type,
        },
      });

      // upload file using our pre-approved AWS url
      let res = await uploadToAWS(
        signedUploadUrl.data.getSignedUrl.url,
        preparedFile
      );

      // finally set the url we want to save to the db with our image
      updateUser({ icon: res });
    }
  };

  const updatePhone = (text) => {
    debounce(
      () => {
        updateUser({ phone: text });
      },
      1000,
      { leading: false, trailing: true }
    );
  };

  const updateName = (text) => {
    debounce(
      () => {
        updateUser({
          uname: text,
        });
      },
      1000,
      { leading: false, trailing: true }
    );
  };

  const updateUser = async (updates) => {
    try {
      const { user: userObj } = data;

      let updatedUser = {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        phone: userObj.phone,
        uname: userObj.uname,
        icon: userObj.icon,
        ...updates,
      };

      await updateUserMutation({
        variables: {
          id: user,
          ...updatedUser,
        },
      });
    } catch (err) {
      console.error(err.message);
      // Alert.alert("Error", "There was an error updating your profile.");
    }
  };

  if (loading) {
    return <CenteredLoaderWithText text={"Loading Profile"} />;
  }

  if (error) {
    return <CenteredErrorLoader text={"Error Retrieving Profile"} />;
  }

  console.log(data);
  const userObj = data.user;
  const stats = {
    voteCount: userObj.votes.items.length,
    circleCount: userObj.circles.items.length,
    revisionCount: userObj.revisions.items.length,
    passedRevisionCount: userObj.revisions.items.filter((r) => r.passed).length,
  };

  return (
    <ScrollView
      styles={[styles.wrapper, !isMobile ? { paddingHorizontal: "20%" } : {}]}
    >
      <KeyboardAvoidingView behavior="position">
        <View style={styles.userAndImageWrapper}>
          <Text style={styles.userNameText}>
            {userObj.firstName + " " + userObj.lastName}
          </Text>
          <AvatarPicker
            uri={userObj.uri}
            onImageChange={updateURI}
            rounded={true}
          />
        </View>
        {/* Info */}
        <View style={styles.section}>
          <Title text={"My Info"} />
          <InfoLine
            label={"Phone"}
            value={userObj.phone}
            onChangeText={updatePhone}
          />
          {/* <InfoLine
                            icon={"at-sign"}
                            label={"Email"}
                            value={user.email}
                            onChangeText={updateEmail}
                        /> */}
          <InfoLine
            label={"Unique Name"}
            value={userObj.uname}
            onChangeText={updateName}
          />
          <DisclaimerText
            blue
            text={"Email and Phone Number will not be publicly visible."}
          />
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Title text={"Statistics"} />
          <Statistic header="Circles" text={stats.circleCount} />
          <Statistic header="Revisions Proposed" text={stats.revisionCount} />
          <Statistic
            header="Revisions Accepted"
            text={stats.passedRevisionCount}
          />
          <Statistic header="Times Voted" text={stats.voteCount} />
          <Statistic
            header="User Since"
            text={new Date(userObj.createdAt).toLocaleDateString()}
          />
        </View>
        <View style={[styles.section, { marginBottom: 50 }]}>
          <Title text={"User Preferences"} />
          <SwitchLine
            onPress={updatePref}
            label={"Allow Marketing Emails"}
            value={userObj.prefs.maySendMarketingEmail}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

// export default compose(
//     graphql(GET_USER_BY_ID_ALL, {
//         name: "getUser",
//         options: ({ userId }) => ({ variables: { id: userId || "" } }),
//     }),
//     graphql(UPDATE_USER, { name: "updateUser" }),
//     graphql(UPDATE_ALLOW_MARKETING_EMAIL, { name: "updateMarketingEmail" }),
//     graphql(GET_USER_PREF_BY_ID, {
//         options: ({ userId }) => ({ variables: { id: userId || "" } }),
//     })
// )(Me);

const styles = StyleSheet.create({
  header: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 13,
    color: "#FFFFFFb7",
    marginBottom: 25,
  },
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  userAndImageWrapper: {
    flex: 1,
    padding: 15,
    width: "100%",
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  disclaimer: {
    fontSize: 15,
    color: "#FFFFFFb7",
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#FFF",
  },
  picker: {
    flexDirection: "column",
    alignItems: "stretch",
    marginBottom: 20,
  },
  backgroundImage: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  marginTop: {
    marginTop: 15,
  },
  wrapSection: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
