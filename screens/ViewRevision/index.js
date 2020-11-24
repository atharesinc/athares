import React, { useEffect, useGlobal, useRef } from "reactn";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Statistic from "../../components/Statistic";
import DiffSection from "./DiffSection";
import { unixTime } from "../../utils/transform";
import MeshAlert from "../../utils/meshAlert";

import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import Title from "../../components/Title";
import DisclaimerText from "../../components/DisclaimerText";
import Card from "../../components/Card";
import VotesCounter from "../../components/VotesCounter";
import GlowButton from "../../components/GlowButton";

import { CREATE_VOTE, UPDATE_VOTE } from "../../graphql/mutations";
import { GET_REVISION_BY_ID, IS_USER_IN_CIRCLE } from "../../graphql/queries";

import { useQuery, useMutation } from "@apollo/client";

// import * as RootNavigation from "../../navigation/RootNavigation";

export default function ViewRevision(props) {
  const [, setActiveChannel] = useGlobal("activeChannel");
  const [activeRevision] = useGlobal("activeRevision");
  const [user] = useGlobal("user");
  const [activeCircle] = useGlobal("activeCircle");
  const [activeViewUser, setActiveViewUser] = useGlobal("activeViewUser");
  let belongsToCircle = useRef(false);

  const { data: isUserInCircle, loading } = useQuery(IS_USER_IN_CIRCLE, {
    variables: { circle: activeCircle || "", user: user || "" },
  });

  const { data, loading: loading2 } = useQuery(GET_REVISION_BY_ID, {
    variables: { id: props.route.params.revision },
  });

  const [createVote] = useMutation(CREATE_VOTE);
  const [updateVote] = useMutation(UPDATE_VOTE);

  useEffect(() => {
    setActiveChannel(null);
  }, []);

  const goToUser = () => {
    setActiveViewUser(data.revision.backer.id, () => {
      props.navigation.navigate("viewOtherUser", {
        user: activeViewUser,
      });
    });
  };

  const renderHasVoted = ({ updatedAt = new Date(), support = true }) => {
    if (support) {
      return (
        <DisclaimerText
          green
          text={`You voted to support this on ${new Date(
            updatedAt
          ).toLocaleString()}`}
        />
      );
    }
    return (
      <DisclaimerText
        red
        text={`You voted to reject this on ${new Date(
          updatedAt
        ).toLocaleString()}`}
      />
    );
  };

  const voteToSupport = () => vote(true);

  const voteToReject = () => vote(false);

  const vote = async (support) => {
    // make sure the user belongs to this circle
    if (
      !isUserInCircle ||
      !isUserInCircle.circlesList ||
      isUserInCircle.circlesList.items[0].id !== activeCircle
    ) {
      return false;
    }

    if (data && data.revision) {
      const { votes, ...revision } = data.revision;
      // If the user attempts to vote after the revision expires, stop and return;
      if (unixTime() >= unixTime(revision.expires)) {
        return false;
      }

      const hasVoted = votes.items.find(({ user: { id } }) => id === user);

      try {
        if (hasVoted) {
          // if their vote is the same don't change it
          if (hasVoted.support === support) {
            return false;
          }
          // update this user's existing vote
          updateVote({
            variables: {
              vote: hasVoted.id,
              support,
            },
          });
        } else {
          // create a new vote, this user hasn't voted yet
          createVote({
            variables: {
              revision: activeRevision,
              user: user,
              support,
            },
          });
        }
      } catch (err) {
        console.error(new Error(err));
        MeshAlert({
          title: "Error",
          text: "Unable to cast vote. Please try again later",
          icon: "error",
        });
      }
    }
  };

  if (
    isUserInCircle &&
    isUserInCircle.circlesList &&
    isUserInCircle.circlesList.items.length !== 0 &&
    isUserInCircle.circlesList.items[0].id === activeCircle
  ) {
    belongsToCircle.current = true;
  }

  if (loading || loading2 || !data) {
    return <CenteredLoaderWithText />;
  }

  const revision = data.revision;
  const { votes } = revision;

  const support = votes.items.filter(({ support }) => support).length;
  const reject = votes.items.length - support;

  const hasVoted = votes.items.find(({ user: { id } }) => id === user);
  const hasExpired = unixTime() >= unixTime(revision.expires);
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View>
        <Title text={revision.title} />
        <View style={styles.cardStats}>
          <DisclaimerText
            upper
            grey
            text={"REVIEW PROPOSED AMENDMENT"}
            style={styles.marginBottomZero}
          />
          <VotesCounter support={support} reject={reject} />
        </View>
        {hasVoted && renderHasVoted(hasVoted)}
        {/* card */}
        {revision.amendment ? (
          <DiffSection {...revision} />
        ) : (
          <Card style={{ minHeight: "20%" }}>
            <DisclaimerText
              text={revision.newText}
              style={styles.marginBottomZero}
            />
          </Card>
        )}
        <Statistic
          header="Proposed"
          text={new Date(revision.createdAt).toLocaleString()}
        />
        <Statistic
          header="Expires"
          text={new Date(revision.expires).toLocaleString()}
        />
        <View style={styles.cardStats}>
          <Statistic
            header="Votes to Support"
            text={support}
            style={styles.half}
          />
          <Statistic
            header="Votes to Reject"
            text={reject}
            style={styles.half}
          />
        </View>
        {hasExpired && (
          <Statistic header="Passed" text={revision.passed ? "Yes" : "No"} />
        )}
        <TouchableOpacity onPress={goToUser}>
          <View style={styles.backerWrapper}>
            <View style={styles.backerImgWrapper}>
              <Image
                style={styles.backerImg}
                source={{ uri: revision.backer.icon }}
              />
            </View>
            <Title
              text={revision.backer.firstName + " " + revision.backer.lastName}
              style={[styles.marginBottomZero, styles.marginLeft]}
            />
          </View>
        </TouchableOpacity>
      </View>
      {user && !hasExpired && belongsToCircle.current && (
        <View style={styles.voteSectionWrapper}>
          <GlowButton
            green
            text={"SUPPORT"}
            data-support={"true"}
            style={styles.voteButtons}
            onPress={voteToSupport}
          />
          <GlowButton
            red
            text={"REJECT"}
            data-support={"false"}
            style={styles.voteButtons}
            onPress={voteToReject}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
    padding: 15,
  },
  marginBottomZero: {
    marginBottom: 0,
  },
  marginLeft: {
    marginLeft: 20,
  },
  cardWrapper: {
    width: "100%",
    marginBottom: 15,
  },
  cardHeader: {
    backgroundColor: "#3a3e52",
    // width: "100%",
    padding: 10,
    color: "#FFFFFF",
  },
  half: {
    width: "50%",
  },
  voteButtons: {
    width: "48%",
  },
  backerImgWrapper: {
    borderRadius: 9999,
    height: 40,
    width: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderColor: "#FFF",
    borderWidth: 2,
  },
  cardBody: {
    width: "100%",
    padding: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#282a38",
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  cardCategory: {
    borderRadius: 9999,
    borderWidth: 2,
    paddingVertical: 2,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#00DFFC",
  },
  cardCategoryText: {
    textTransform: "uppercase",
    color: "#00DFFC",
    marginHorizontal: 5,
  },
  cardVotesSupport: {
    fontSize: 12,
    color: "#9eebcf",
  },
  cardVotesReject: {
    fontSize: 12,
    color: "#ff725c",
  },
  revisionText: {
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 15,
  },
  backerWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  backerImg: {
    height: 40,
    width: 40,
    borderRadius: 9999,
  },
  proposedDate: {
    fontSize: 15,
    color: "#FFFFFFb7",
  },
  greenText: {
    color: "#9eebcf",
  },
  redText: {
    color: "#ff725c",
  },
  greenBorder: {
    borderColor: "#9eebcf",
  },
  redBorder: {
    borderColor: "#ff725c",
  },
  disclaimer: {
    fontSize: 15,
    color: "#FFFFFFb7",
    marginBottom: 10,
  },
  wrapSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  voteSectionWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
