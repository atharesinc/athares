import React, { useState, useGlobal, useEffect } from "reactn";

import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  View,
} from "react-native";

import { CREATE_REVISION_FROM_AMENDMENT } from "../../graphql/mutations";

import { GET_AMENDMENT_BY_ID } from "../../graphql/queries";

import { sha } from "../../utils/crypto";
import { validateUpdatedRevision } from "../../utils/validators";
import MeshAlert from "../../utils/meshAlert";

import { parseDate } from "../../utils/transform";
import { addSeconds } from "date-fns";

import GlowButton from "../../components/GlowButton";
import DisclaimerText from "../../components/DisclaimerText";
import CrossAutoGrow from "../../components/CrossAutoGrow";

import { useQuery, useMutation } from "@apollo/client";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";

export default function EditAmendment(props) {
  const [text, setText] = useState("");
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [loading, setLoading] = useState(false);
  const [createRevisionMutation] = useMutation(CREATE_REVISION_FROM_AMENDMENT);
  const [activeAmendment, setActiveAmendment] = useGlobal("activeAmendment");

  const { data, loading: loadingQuery, error } = useQuery(GET_AMENDMENT_BY_ID, {
    variables: {
      id: props.route.params.amendment,
    },
  });

  useEffect(() => {
    if (data?.amendment) {
      setText(data.amendment.text);
    }

    // Update Title after loading data if we don't already have it
    if (data && data.amendment && !props.route.params.name) {
      const {
        amendment: { title },
      } = data;
      props.navigation.setParams({ name: title });
    }
  }, [data]);

  useEffect(() => {
    if (activeCircle !== props.route.params.circle) {
      setActiveCircle(props.route.params.circle);
    }
    if (!activeAmendment) {
      setActiveAmendment(props.route.params.amendment);
    }
  }, []);

  const confirmRepeal = () => {
    MeshAlert({
      title: "Confirm Repeal?",
      text:
        "Are you sure you'd like to repeal this amendment?\n\nBy starting the repeal process, you will create a revision with the intention of permanently deleting this amendment.",
      submitText: "Yes, Repeal",
      onSubmit: repeal,
      icon: "warning",
    });
  };

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
      MeshAlert({
        title: "Error",
        text: "There was an error in the repeal process",
        icon: "error",
      });
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
      throw new Error("Amendments must have text.");
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

      setActiveRevision(newRevision.id, () => {
        props.navigation.navigate("viewRevision", {
          revision: newRevision.id,
          circle: activeCircle,
        });
      });
    } catch (err) {
      console.error(err);
      MeshAlert({ title: "Error", text: err.message, icon: "error" });
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
        <CrossAutoGrow
          value={text}
          onChangeText={setText}
          label={data.amendment.title}
          autoFocus={true}
          description={
            "Here you can make changes to the existing amendment. If you'd instead like to remove the amendment altogether, select 'Repeal Amendment'."
          }
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
            onPress={confirmRepeal}
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
