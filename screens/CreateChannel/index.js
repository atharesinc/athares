import React, { useGlobal, useState, useEffect } from "reactn";

import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  View,
} from "react-native";

import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import { CREATE_CHANNEL } from "../../graphql/mutations";
import { GET_CIRCLE_NAME_BY_ID } from "../../graphql/queries";
import { validateChannel } from "../../utils/validators";

import { useMutation, useQuery } from "@apollo/react-hooks";

import Title from "../../components/Title";
import Input from "../../components/Input";
import HelperText from "../../components/HelperText";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";

export default function CreateChannel(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeCircle] = useGlobal("activeCircle");
  const [activeChannel, setActiveChannel] = useGlobal("activeChannel");

  const [user] = useGlobal("user");
  const [createChannel] = useMutation(CREATE_CHANNEL);
  const { data, loading: loadingQuery } = useQuery(GET_CIRCLE_NAME_BY_ID, {
    variables: {
      id: activeCircle || "",
    },
  });

  useEffect(() => {
    // navigate away after we've updated active channel to view
    if (activeChannel) {
      props.navigation.navigate("channel");
    }
  }, [activeChannel]);

  const submit = async () => {
    setLoading(true);

    let finalName = name.trim();
    let finalDescription = description.trim();
    try {
      const isValid = validateChannel({
        name: finalName,
      });

      if (isValid !== undefined) {
        console.error("Error", isValid[Object.keys(isValid)[0]][0]);
        throw "Please provide a name for this channel.";
      }

      // create channel
      let newChannel = {
        name: finalName,
        description: finalDescription,
        channelType: "group",
        circleId: activeCircle,
      };

      let newChannelRes = await createChannel({
        variables: {
          ...newChannel,
          user,
        },
      });

      newChannel.id = newChannelRes.data.channelCreate.id;

      // set activeChannel as this one
      setActiveChannel(newChannel.id);
      Alert.alert(
        "Channel Created",
        `${name} has been created in the Circle ${data.circle.name}.`
      );
    } catch (err) {
      console.error(new Error(err));
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingQuery) {
    return <CenteredLoaderWithText />;
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <KeyboardAvoidingView behavior="padding" style={styles.anchorToBottom}>
        <View>
          <DisclaimerText
            upper
            grey
            text={`Create a new channel within ${data.circle.name}`}
          />
          <Input
            label={"Name"}
            onChangeText={setName}
            value={name}
            description={"This must be unique"}
          />
          <Input
            value={description}
            onChangeText={setDescription}
            label={"Description"}
            description={"Describe this channel (optional)."}
            multiline={true}
          />
        </View>

        <View>
          <DisclaimerText
            text={`By pressing "Create Channel" you will create a new channel within ${data.circle.name}.`}
          />
          <GlowButton text="Create Channel" onPress={submit} />
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
    padding: 13,
  },
  anchorToBottom: {
    flex: 1,
    justifyContent: "space-between",
  },
});
