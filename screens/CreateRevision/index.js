import React, { useState, useGlobal, useEffect } from "reactn";
import {
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  View,
} from "react-native";

import DisclaimerText from "../../components/DisclaimerText";
import Input from "../../components/Input";
import GlowButton from "../../components/GlowButton";

import { sha } from "../../utils/crypto";
import { validateNewRevision } from "../../utils/validators";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_AMENDMENTS_FROM_CIRCLE_ID } from "../../graphql/queries";

import { CREATE_REVISION } from "../../graphql/mutations";

import { UIActivityIndicator } from "react-native-indicators";

function CreateRevision(props) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeRevision, setActiveRevision] = useGlobal("activeRevision");
  const [activeCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");

  const [createRevision] = useMutation(CREATE_REVISION);
  const { data, loading: loadingQuery } = useQuery(
    GET_AMENDMENTS_FROM_CIRCLE_ID,
    {
      variables: {
        id: activeCircle,
      },
    }
  );

  // the longest a revision must persist before votes are counted is 7 days ( many users), the shortest is about 60 seconds (1 user)
  // add this number of seconds to the createdAt time to determine when a revision should expire, where x is the number of users
  const customSigm = (x) => {
    return 604800 / (1 + Math.pow(Math.E, -1 * (x - 10))) / 2;
  };
  // a minimum number of users in a circle must have voted on a revision to ratify it
  // this prevents someone from sneaking in a revision where only one person votes to support and no one rejects it
  const ratifiedThreshold = (n) => {
    return 0.4 / (1 + Math.pow(Math.E, -1 * n * 0.2));
  };

  // navigate to new revision after we've created it
  useEffect(() => {
    if (activeRevision) {
      props.navigation.navigate("viewRevision");
    }
  }, [activeRevision]);

  const submit = async (e) => {
    // validate & trim fields

    try {
      const finalTitle = title.trim();
      const finalText = text.trim();

      const isValid = validateNewRevision({
        title: finalTitle,
        text: finalText,
      });

      if (isValid !== undefined) {
        console.error("Error", isValid[Object.keys(isValid)[0]][0]);
        throw "Sorry, Circles must have a name and preamble.";
      }

      setLoading(true);

      let numUsers = data.circle.users.items.length;

      let newRevision = {
        circle: activeCircle,
        user: user,
        title: finalTitle,
        newText: finalText,
        expires: new Date(
          new Date().getTime() + Math.max(customSigm(numUsers), 61) * 1000
        ).toJSON(),
        voterThreshold: Math.round(numUsers * ratifiedThreshold(numUsers)),
        repeal: false,
      };
      let hash = await sha(
        JSON.stringify({
          title: newRevision.title,
          text: newRevision.newText,
          circle: newRevision.circle,
          expires: newRevision.expires,
          voterThreshold: newRevision.voterThreshold,
        })
      );

      let newRevisionRes = await createRevision({
        variables: {
          ...newRevision,
          hash,
        },
      });

      newRevision.id = newRevisionRes.data.revisionCreate.id;

      setActiveRevision(newRevision.id);
    } catch (err) {
      if (
        !err.message.includes("unique constraint would be violated") ||
        !err.message.includes("hash")
      ) {
        console.error(err);
        Alert.alert(
          "Error",
          "There was an error connecting to the Athares network. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingQuery || !activeCircle || !data.circle) {
    return (
      <View
        styles={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <UIActivityIndicator color={"#FFFFFF"} />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyles={styles.wrapper}>
      <KeyboardAvoidingView behavior="padding">
        <DisclaimerText
          upper
          text={`DRAFT A NEW PIECE OF LEGISLATION FOR ${data.circle.name}`}
        />
        <Input
          label={"Amendment Title"}
          description={"Provide a name for your new amendment."}
          onChangeText={setTitle}
          value={title}
        />
        <Input
          value={text}
          onChangeText={setText}
          label={"Amendment Body"}
          description={
            "Draft your amendment. What do you want to add to this organization?"
          }
          multiline={true}
        />
        <DisclaimerText
          text={
            'Pressing "Draft Amendment" will create a new revision for this amendment. Drafts must first be ratified by a minimum electorate of Circle members, and then must be approved with a majority of votes. Amendment drafts are publicly accessible.'
          }
        />
        <GlowButton text="Draft Amendment" onPress={submit} />
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
});

export default CreateRevision;
