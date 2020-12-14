import React, { useState, useGlobal, useEffect } from "reactn";
import { ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";

import CrossAutoGrow from "../../components/CrossAutoGrow";

import DisclaimerText from "../../components/DisclaimerText";
import Input from "../../components/Input";
import GlowButton from "../../components/GlowButton";

import { sha } from "../../utils/crypto";
import { validateNewRevision } from "../../utils/validators";
import MeshAlert from "../../utils/meshAlert";
import useBelongsInCircle from "../../utils/useBelongsInCircle";

import { useQuery, useMutation } from "@apollo/client";
import { GET_AMENDMENTS_FROM_CIRCLE_ID } from "../../graphql/queries";

import { CREATE_REVISION } from "../../graphql/mutations";
import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";

export default function CreateRevision(props) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [, setActiveRevision] = useGlobal("activeRevision");
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");

  const [createRevision] = useMutation(CREATE_REVISION);
  const { data, loading: loadingQuery, error } = useQuery(
    GET_AMENDMENTS_FROM_CIRCLE_ID,
    {
      variables: {
        id: props.route.params.circle,
      },
    }
  );

  let belongsToCircle = useBelongsInCircle({
    circle: activeCircle,
    user: user,
  });

  useEffect(() => {
    if (activeCircle !== props.route.params.circle) {
      setActiveCircle(props.route.params.circle);
    }
  }, []);

  // Update Title after loading data if we don't already have it
  useEffect(() => {
    if (data && data.circle && !props.route.params.name) {
      const {
        circle: { name },
      } = data;
      props.navigation.setParams({ name });
    }
  }, [data]);

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

  const submit = async () => {
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
        voterThreshold: Math.round(
          numUsers * ratifiedThreshold(numUsers)
        ).toString(),
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

      setActiveRevision(newRevision.id, () => {
        props.navigation.navigate("viewRevision", {
          circle: activeCircle,
          revision: newRevision.id,
        });
      });
    } catch (err) {
      if (
        err.message?.includes("unique constraint would be violated") ||
        err.message?.includes("hash")
      ) {
        MeshAlert({
          title: "Error",
          text:
            "There was an error connecting to the Athares network. Please try again later.",
          icon: "error",
        });
      }
      MeshAlert({
        title: "Error",
        text: err,
        icon: "error",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || loadingQuery || !activeCircle) {
    return <CenteredLoaderWithText />;
  }

  if (error) {
    return <CenteredErrorLoader text={"Unable to Draft an Amendment"} />;
  }

  if (!data.circle) {
    return <CenteredErrorLoader text={"Circle Does Not Exist"} />;
  }

  if (!user) {
    return (
      <CenteredErrorLoader
        text={"You must be logged in to create an amendment"}
      />
    );
  }

  if (!belongsToCircle) {
    return (
      <CenteredErrorLoader
        text={"Only memebers of the Circle can create an amendment"}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
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
        {/* <Input
          value={text}
          onChangeText={setText}
          label={"Amendment Body"}
          description={
            "Draft your amendment. What do you want to add to this organization?"
          }
          multiline={true}
        /> */}
        <CrossAutoGrow
          value={text}
          onChangeText={setText}
          label={"Amendment Body"}
          // onBlur={focusOff}
          autoFocus={true}
          // isFocused={isFocused}
          description={
            "Draft your amendment. What do you want to add to this organization?"
          }
        />

        <DisclaimerText
          text={
            "Pressing 'Draft Amendment' will create a new revision for this amendment. Drafts must first be ratified by a minimum electorate of Circle members, and then must be approved with a majority of votes. Amendment drafts are publicly accessible."
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
    padding: 15,
  },
});
