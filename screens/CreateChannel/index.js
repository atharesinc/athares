import React, { useGlobal, useState, useEffect } from "reactn";

import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  View,
} from "react-native";

import { UIActivityIndicator } from "react-native-indicators";
import { CREATE_CHANNEL } from "../../graphql/mutations";
import { GET_CIRCLE_NAME_BY_ID } from "../../graphql/queries";
import { validateChannel } from "../../utils/validators";

import { useMutation, useQuery } from "@apollo/react-hooks";

import Title from "../../components/Title";
import Input from "../../components/Input";
import HelperText from "../../components/HelperText";
import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";

function CreateChannel(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeCircle] = useGlobal("activeCircle");

  const [user] = useGlobal("user");
  const [createChannel] = useMutation(CREATE_CHANNEL);
  const { data, loading: loadingQuery } = useQuery(GET_CIRCLE_NAME_BY_ID);

  useEffect(() => {
    if (!activeChannel) {
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

      // create circle
      let newChannel = {
        name: finalName,
        description: finalDescription,
      };

      let newChannelRes = await createChannel({
        variables: {
          ...newCircle,
          user,
        },
      });

      newChannel.id = newChannelRes.data.createChannel.id;

      // set activeCircle as this one
      setActiveChannel(newChannel.id);
      Alert.alert("Circle Created", `${name} has been created successfully.`);
    } catch (err) {
      console.error(new Error(err));
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingQuery) {
    return (
      <View styles={styles.wrapper}>
        <UIActivityIndicator color={"#FFFFFF"} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <DisclaimerText
            upper
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

          <DisclaimerText
            text={`By pressing "Create Channel" you will create a new channel within ${data.circle.name}.`}
          />
          <GlowButton text="Create Channel" onPress={submit} />
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
    padding: 13,
  },
});

export default CreateChannel;
