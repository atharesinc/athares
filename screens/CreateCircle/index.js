import React, { useGlobal, useState } from "reactn";

import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  View,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import AvatarPicker from "../../components/AvatarPicker";
import MeshAlert from "../../utils/meshAlert";

import {
  CREATE_CIRCLE,
  CREATE_SIGNED_UPLOAD_LINK,
} from "../../graphql/mutations";
import { processFile, uploadToAWS } from "../../utils/upload";
import { validateCircle } from "../../utils/validators";

import { useMutation } from "@apollo/client";

import Title from "../../components/Title";
import Input from "../../components/Input";
import HelperText from "../../components/HelperText";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";

import getEnvVars from "../../env";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";

const { DEFAULT_CIRCLE_IMG } = getEnvVars();

function CreateCircle(props) {
  const [name, setName] = useState("");
  const [preamble, setPreamble] = useState("");
  const [uri, setUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setActiveCircle] = useGlobal("activeCircle");
  // const [activeTheme] = useGlobal("activeTheme");
  const [user] = useGlobal("user");
  const [createCircle] = useMutation(CREATE_CIRCLE);
  const [getSignedUrl] = useMutation(CREATE_SIGNED_UPLOAD_LINK);

  const notLoggedInError = () => {
    MeshAlert({
      title: "Whoa There!",
      text: `You can only create a new Circle if you're logged in. Would you like to be taken to the login page?`,
      icon: "error",
      onSubmit: () => {
        props.navigation.navigate("portal", { screen: "login" });
      },
    });
  };
  const submit = async () => {
    if (!user) {
      notLoggedInError();
      return;
    }

    setLoading(true);

    let finalImage;
    let url = DEFAULT_CIRCLE_IMG;
    let finalName = name.trim();
    let finalPreamble = preamble.trim();
    try {
      const isValid = validateCircle({
        name: finalName,
        preamble: finalPreamble,
      });

      if (isValid !== undefined) {
        console.error("Error", isValid[Object.keys(isValid)[0]][0]);
        throw new Error("Sorry, Circles must have a name and preamble.");
      }

      // if the user is using the default image, just use our global icon file
      if (uri) {
        finalImage = await ImageManipulator.manipulateAsync(
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
        url = res;
      }

      // create circle
      let newCircle = {
        name: finalName,
        preamble: finalPreamble,
        icon: url,
      };

      let newCircleRes = await createCircle({
        variables: {
          ...newCircle,
          user,
        },
      });

      newCircle.id = newCircleRes.data.circleCreate.id;

      // set activeCircle as this one
      setName("");
      setPreamble("");
      setUri(null);

      MeshAlert({
        title: "Circle Created",
        text: `${name} has been created successfully.`,
        icon: "success",
      });

      setActiveCircle(newCircle.id, () => {
        props.navigation.navigate("constitution", { circle: newCircle.id });
      });
    } catch (err) {
      console.error(new Error(err));
      MeshAlert({ title: "Error", text: err.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CenteredLoaderWithText />;
  }

  return (
    <View style={[styles.wrapper]}>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <DisclaimerText
            upper
            text={"CIRCLES ARE COLLABORATIVE, VOTING-CENTRIC ORGANIZATIONS"}
          />
          <Input
            label={"Circle Name"}
            onChangeText={setName}
            value={name}
            description={"This must be unique"}
          />
          <Input
            value={preamble}
            onChangeText={setPreamble}
            label={"Preamble"}
            description={
              "Describe your Circle in a few sentences. This will be visible at the top of the Constitution and outlines the vision of this organization."
            }
            multiline={true}
          />
          <Title text={"Flag"} />
          <HelperText text={"Update and edit the flag for this Circle."} />
          <AvatarPicker onImageChange={setUri} uri={uri} />
          <DisclaimerText
            text={
              "By pressing 'Create Circle' you will create a new government with the above name, preamble, and the selected image."
            }
          />
          <GlowButton text="Create Circle" onPress={submit} />
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    padding: 15,
  },
});

export default CreateCircle;
