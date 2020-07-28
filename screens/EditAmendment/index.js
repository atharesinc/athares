import React, { useState, useGlobal, useEffect } from "reactn";

import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

import { CREATE_REVISION } from "../../graphql/mutations";

import { GET_AMENDMENT_BY_ID } from "../../graphql/queries";

import { sha } from "../../../utils/crypto";
import { validateUpdatedRevision } from "../../utils/validators";

import GlowButton from "../../../components/GlowButton";
import DisclaimerText from "../../../components/DisclaimerText";
import Input from "../../../components/Input";

import { useQuery, useMutation } from "@apollo/client";

export default function EditAmendment(props) {
  const [text, setText] = useState("");
  const [activeCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");
  const [activeRevision, setActiveRevision] = useGlobal("activeRevision");

  const [createRevision] = useMutation(CREATE_REVISION);

  const { data, loading: loadingQuery } = useQuery(GET_AMENDMENT_BY_ID, {
    variables,
  });

  const confirmRepeal = () => {
    Alert.alert(
      "Confirm Repeal?",
      "Are you sure you'd like to repeal this amendment?\n\nBy starting the repeal process, you will create a revision with the intention of permanently deleting this amendment.",
      [
        {
          text: "Yes, Repeal",
          onPress: () => repeal(),
        },
        { text: "Cancel", onPress: () => {}, style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (activeRevision) {
      props.navigation.navigate("viewRevision");
    }
  }, [activeRevision]);

  const repeal = () => {
    try {
      let numUsers = data.amendment.circle.users.items.length;

      let newRevision = {
        circle: activeCircle,
        user: user,
        title: data.amendment.title,
        oldText: null,
        newText: data.amendment.text,
        expires: moment()
          .add(Math.max(customSigm(numUsers), 61), "s")
          .format(),
        voterThreshold: Math.round(numUsers * ratifiedThreshold(numUsers)),
        amendment: data.amendment.id,
        repeal: true,
      };

      createRevision(newRevision);
    } catch (err) {
      console.error(new Error(err));
      swal("Error", "There was an error in the repeal process", "error");
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
    // reject if there's been no changes
    if (data.amendment.text.trim() === text.trim()) {
      return;
    }

    let numUsers = data.circle.users.items.length;

    let newRevision = {
      circle: activeCircle,
      user: user,
      title: data.amendment.title,
      oldText: data.amendment.text,
      newText: text.trim(),
      expires: moment()
        .add(Math.max(customSigm(numUsers), 61), "s")
        .format(),
      voterThreshold: Math.round(numUsers * ratifiedThreshold(numUsers)),
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

      let newRevisionRes = await this.props.createRevision({
        variables: {
          ...newRevision,
          hash,
        },
      });

      newRevision.id = newRevisionRes.data.createRevision.id;

      setActiveRevision(newRevision.id);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyles={styles.wrapper}>
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
            'Pressing "Update Amendment" will create a revision for this amendment. If the revision gains the minimum number of votes to be ratified and the majority of voters support these changes, then the existing Amendment will be replaced with these changes.'
          }
        />

        <GlowButton text="Update Amendment" onPress={submit} />
        <GlowButton text="Repeal Amendment" onPress={repeal} red />
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
});
