import React, { useState, useGlobal, useEffect } from "reactn";

import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  View,
} from "react-native";

import { CREATE_REVISION_FROM_AMENDMENT } from "../../graphql/mutations";

import { GET_AMENDMENT_BY_ID } from "../../graphql/queries";

import { sha } from "../../utils/crypto";
import { validateUpdatedRevision } from "../../utils/validators";

import { parseDate } from "../../utils/transform";
import { addSeconds } from "date-fns";

import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";
import Input from "../../components/Input";

import { useQuery, useMutation } from "@apollo/client";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";

export default function EditAmendment(props) {
  const [text, setText] = useState("");
  const [activeCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");
  const [activeRevision, setActiveRevision] = useGlobal("activeRevision");
  const [loading, setLoading] = useState(false);
  const [createRevisionMutation] = useMutation(CREATE_REVISION_FROM_AMENDMENT);
  const [activeAmendment] = useGlobal("activeAmendment");

  const { data, loading: loadingQuery, error } = useQuery(GET_AMENDMENT_BY_ID, {
    variables: {
      id: activeAmendment || "",
    },
  });

  useEffect(() => {
    if (data && data.amendment) {
      setText(data.amendment.text);
    }
  }, [data]);

  // const confirmRepeal = () => {
  //     Alert.alert(
  //         "Confirm Repeal?",
  //         "Are you sure you'd like to repeal this amendment?\n\nBy starting the repeal process, you will create a revision with the intention of permanently deleting this amendment.",
  //         [
  //             {
  //                 text: "Yes, Repeal",
  //                 onPress: () => repeal(),
  //             },
  //             { text: "Cancel", onPress: () => {}, style: "cancel" },
  //         ],
  //         { cancelable: true }
  //     );
  // };

  useEffect(() => {
    if (activeRevision) {
      props.navigation.navigate("viewRevision", {
        revision: activeRevision,
        circle: activeCircle,
      });
    }
  }, [activeRevision]);

  const repeal = () => {
    setLoading(true);
    try {
      let numUsers = data.amendment.circle.users.items.length;

      let newRevision = {
        circle: activeCircle,
        user: user,
        title: data.amendment.title,
        oldText: null,
        newText: data.amendment.text,
        expires: parseDate(
          addSeconds(new Date(), Math.max(customSigm(numUsers), 61))
        ),
        voterThreshold: Math.round(
          numUsers * ratifiedThreshold(numUsers)
        ).toString(),
        amendment: data.amendment.id,
        repeal: true,
      };

      createRevision(newRevision);
    } catch (err) {
      console.error(new Error(err));
      // swal("Error", "There was an error in the repeal process", "error");
    }
  };

  const customSigm = (x) => {
    return 604800 / (1 + Math.pow(Math.E, -1 * (x - 10))) / 2;
  };

  // a minimum number of users in a circle must have voted on a revision to ratify it
  // this prevents someone from sneaking in a revision where only one person votes to support and no one rejects it
  const ratifiedThreshold = (n) => {
    return 0.4 / (1 + Math.pow(Math.E, -1 * n * 0.2));
  };

  const submit = async () => {
    setLoading(true);
    // reject if there's been no changes
    if (data.amendment.text.trim() === text.trim()) {
      return;
    }

    // validateUpdatedRevision
    const isValid = validateUpdatedRevision({
      text,
    });

    if (isValid !== undefined) {
      console.error("Error", isValid[Object.keys(isValid)[0]][0]);
      throw new Error("Sorry, Amendments must have text.");
    }

    let numUsers = data.amendment.circle.users.items.length;

    let newRevision = {
      circle: activeCircle,
      user: user,
      title: data.amendment.title,
      oldText: data.amendment.text,
      newText: text.trim(),
      expires: parseDate(
        addSeconds(new Date(), Math.max(customSigm(numUsers), 61))
      ),
      voterThreshold: Math.round(
        numUsers * ratifiedThreshold(numUsers)
      ).toString(),
      amendment: data.amendment.id,
      repeal: false,
    };
    createRevision(newRevision);
  };

  const createRevision = async (newRevision) => {
    try {
      let hash = sha(
        JSON.stringify({
          title: newRevision.title,
          text: newRevision.newText,
          circle: newRevision.circle,
          expires: newRevision.expires,
          voterThreshold: newRevision.voterThreshold,
        })
      );

      let newRevisionRes = await createRevisionMutation({
        variables: {
          ...newRevision,
          hash,
        },
      });

      newRevision.id = newRevisionRes.data.revisionCreate.id;

      setActiveRevision(newRevision.id);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingQuery || !data) {
    return <CenteredLoaderWithText />;
  }
  // Network Error
  if (error) {
    return <CenteredErrorLoader text={"Unable to connect to network"} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <KeyboardAvoidingView behavior="padding">
        <DisclaimerText text={"EDIT OR REPEAL THIS AMENDMENT"} />
        <Input
          value={text}
          onChangeText={setText}
          label={data.amendment.title}
          description={
            "Here you can make changes to the existing amendment. If you'd instead like to remove the amendment altogether, select 'Repeal Amendment'."
          }
          multiline={true}
        />
        <DisclaimerText
          text={
            "Pressing 'Update Amendment' will create a revision for this amendment. If the revision gains the minimum number of votes to be ratified and the majority of voters support these changes, then the existing Amendment will be replaced with these changes."
          }
        />
        <View style={styles.voteSectionWrapper}>
          <GlowButton
            text="Update Amendment"
            onPress={submit}
            style={styles.voteButtons}
          />
          <GlowButton
            text="Repeal Amendment"
            onPress={repeal}
            red
            style={styles.voteButtons}
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
    padding: 15,
  },
  voteButtons: {
    width: "48%",
  },
  voteSectionWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
