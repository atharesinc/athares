import React, { useGlobal, useState } from "reactn";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import debounce from "lodash.debounce";
import MeshAlert from "../../utils/meshAlert";

import AvatarPicker from "../../components/AvatarPicker";
import InfoLine from "../../components/InfoLine";
import Title from "../../components/Title";
import Statistic from "../../components/Statistic";
import SwitchLine from "../../components/SwitchLine";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import Loader from "../../components/Loader";

import {
  UPDATE_ALLOW_MARKETING_EMAIL,
  UPDATE_USER,
  CREATE_SIGNED_UPLOAD_LINK,
} from "../../graphql/mutations";
import {
  GET_USER_WITH_PREF_BY_ID,
  CHECK_IF_UNAME_TAKEN,
  CHECK_IF_EMAIL_TAKEN,
  CHECK_IF_PHONE_TAKEN,
} from "../../graphql/queries";
import { useQuery, useMutation } from "@apollo/client";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";
import DisclaimerText from "../../components/DisclaimerText";
import useImperativeQuery from "../../utils/useImperativeQuery";
import { processFile, uploadToAWS } from "../../utils/upload";
import { validateEmailAddress } from "../../utils/validators";

export default function Me() {
  const [user] = useGlobal("user");
  const [isMobile] = useGlobal("isMobile");
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { data, loading, error } = useQuery(GET_USER_WITH_PREF_BY_ID, {
    variables: {
      id: user || "",
    },
  });

  const [updateMarketingEmail] = useMutation(UPDATE_ALLOW_MARKETING_EMAIL);
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const [getSignedUrl] = useMutation(CREATE_SIGNED_UPLOAD_LINK);
  const isUnameTaken = useImperativeQuery(CHECK_IF_UNAME_TAKEN);
  const isEmailTaken = useImperativeQuery(CHECK_IF_EMAIL_TAKEN);
  const isPhoneTaken = useImperativeQuery(CHECK_IF_PHONE_TAKEN);

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

  async function updatePhone(text) {
    if (text !== "") {
      const res = await isPhoneTaken({ id: user, phone: text });
      if (res && res.data.usersList.items.length !== 0) {
        setErrorMessage("this phone has been taken", text);
        return;
      }
    }
    updateUser({ phone: text.trim() });
  }

  async function updateEmail(text) {
    // Validate cause that's sketchy
    const isValid = validateEmailAddress({ email: text });
    if (isValid !== undefined) {
      setErrorMessage("Please supply a valid email address");
      return false;
    }

    const res = await isEmailTaken({ id: user, email: text });
    if (res && res.data.usersList.items.length !== 0) {
      setErrorMessage("This email has been taken");
      return;
    }
    updateUser({ email: text.trim() });
  }

  async function updateName(text) {
    if (text !== "") {
      // Validate to see if this uname is taken
      const res = await isUnameTaken({ id: user, uname: text });
      if (res && res.data.usersList.items.length !== 0) {
        setErrorMessage("This username has been taken");
        return;
      }
    }
    updateUser({
      uname: text.trim(),
    });
  }
  function updateFirst(text) {
    if (text === "") {
      setErrorMessage("First name must not be empty");
      return;
    }
    updateUser({
      firstName: text.trim(),
    });
  }
  function updateLast(text) {
    if (text === "") {
      setErrorMessage("Last name must not be empty");
      return;
    }
    updateUser({
      lastName: text.trim(),
    });
  }
  // Lovely debounced versions that actually get called
  const debouncedUpdateFirst = debounce(updateFirst, 1000, {
    leading: false,
    trailing: true,
  });
  const debouncedUpdateLast = debounce(updateLast, 1000, {
    leading: false,
    trailing: true,
  });
  const debouncedUpdatePhone = debounce(updatePhone, 1000, {
    leading: false,
    trailing: true,
  });
  const debouncedUpdateEmail = debounce(updateEmail, 1000, {
    leading: false,
    trailing: true,
  });
  const debouncedUpdateName = debounce(updateName, 1000, {
    leading: false,
    trailing: true,
  });

  const updateUser = async (updates) => {
    // This might need to be split up with an effect
    setErrorMessage(null);
    setUpdating(true);
    try {
      const { user: userObj } = data;

      // if the end result is the same as what we started with, don't send request
      if (userObj[Object.keys(updates)[0]] === Object.values(updates)[0]) {
        return;
      }

      let updatedUser = {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        phone: userObj.phone,
        uname: userObj.uname,
        icon: userObj.icon,
        email: userObj.email,
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
      MeshAlert({
        title: "Error",
        text: "There was an error updating your profile.",
        icon: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !data) {
    return <CenteredLoaderWithText text={"Loading Profile"} />;
  }

  if (error) {
    return <CenteredErrorLoader text={"Error Retrieving Profile"} />;
  }

  if (!data.user) {
    return <CenteredErrorLoader text={"You must be logged in"} />;
  }

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
            label={"First Name"}
            defaultValue={userObj.firstName}
            onChangeText={debouncedUpdateFirst}
          />
          <InfoLine
            label={"Last Name"}
            defaultValue={userObj.lastName}
            onChangeText={debouncedUpdateLast}
          />
          <InfoLine
            label={"Email"}
            defaultValue={userObj.email}
            onChangeText={debouncedUpdateEmail}
          />
          <InfoLine
            label={"Phone"}
            defaultValue={userObj.phone}
            onChangeText={debouncedUpdatePhone}
          />
          <InfoLine
            label={"Unique Name"}
            defaultValue={userObj.uname}
            onChangeText={debouncedUpdateName}
          />

          {errorMessage ? (
            <DisclaimerText
              red
              text={errorMessage}
              style={{ marginBottom: 0 }}
            />
          ) : updating ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Loader size={25} />
              <DisclaimerText
                grey
                text={"Updating..."}
                style={{ marginBottom: 0, marginLeft: 5 }}
              />
            </View>
          ) : (
            <DisclaimerText
              blue
              text={"Email and Phone Number will not be publicly visible."}
              style={{ marginBottom: 0 }}
            />
          )}
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

const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  marginTop: {
    marginTop: 15,
  },
});
