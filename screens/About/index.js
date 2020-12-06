import React from "react";

import DisclaimerText from "../../components/DisclaimerText";
import Title from "../../components/Title";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function About() {
  return (
    <ScrollView>
      <View style={styles.hero}>
        <DisclaimerText grey spaced>
          What is Athares?
        </DisclaimerText>

        <Text style={styles.bigText}>
          The most ambitious startup in history, maybe.
        </Text>

        <DisclaimerText grey upper spaced style={{ fontSize: 15 }}>
          EVERYTHING YOU NEED TO KNOW ABOUT ATHARES
        </DisclaimerText>
      </View>
      <View style={styles.QAWrapper}>
        {questions.map((q) => (
          <View key={q.id} style={styles.block}>
            <Title text={q.question} />
            <DisclaimerText text={q.text} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  hero: {
    padding: 15,
  },
  QAWrapper: {
    width: "100%",
    backgroundColor: "#282a38",
    padding: 15,
  },
  bigText: {
    fontSize: 40,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
    marginBottom: 30,
  },
  innerWrapper: {
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    padding: 15,
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  block: {
    marginBottom: 10,
  },
});

const questions = [
  {
    id: "what",
    question: "In simple terms, what is Athares?",
    text: `Athares is an app that allows people to create and manage their own governments, called Circles. Whether it's a high school club or a burgeoning democracy, Athares Distributed Democracy Platform acts as a security-first foundation for involvement, outreach, and policy. Vote on issues that are important to you!`,
  },
  {
    id: "how-to-get-started",
    question: "How can I use Athares today?",
    text:
      "Are you a member of a club or organization? Try creating a new Circle and invite some peers. See what you can come up with when you work together!",
  },
  {
    id: "goals",

    question: "What is the goal of Athares?",
    text:
      "The origin of Athares lies in the nearing-prospect of a colony on Mars.  A new colony will need to govern itself, and would eventually fall into the same political pitfalls as modern, terrestrial governments. We want to get it right the first time. Our goal is to avoid the mistakes we've seen in hundreds of years on Earth.  We want to create socially equitable and responsible government to ensure the survival and success of humans on other planets. Our ultimate goal is to empower individuals (regardless of home-planet) to actively participate in their society, to culitvate a political awareness, and to liberate passive citizens from inadequate status-quo of many governments. Be the change you want to see in this world.",
  },
  {
    id: "have-blockchain",
    question: "Does Athares run on a blockchain?",
    text:
      "Athares does not run on a blockchain and it probably won't.  Athares utilizes a client-first approach and Circles rely on active participation to drive functionality, however, we can't yet bridge the gap for creating a fully distributed system, end-to-end. Many of the technologies we'd like to use simply don't exist in the average device. Blockchain-based applications are too slow for most realtime interaction and don't scale well.  Athares uses it's own distributed ledger-like technology for 99% of users and in the meantime we're committed to building distributed systems that can survive the void of space.",
  },
  {
    id: "why-distributed",

    question: "Distributed Democracy? What?",
    text:
      "Inspired by the Direct Democracies around the world, Athares lets users vote on individual issues in their government. Removing representatives eliminates corruption, cuts government costs, and creates overnight progress.  In other models, people vote for the representatives, but little prevents these representatives from betraying their voters or from doing nothing.",
  },
  {
    id: "why-not-direct",

    question: "Shouldn't it be a Direct Democracy?",
    text: `A resilient democracy needs to operate in a completely distributed fashion, so that no single person can control the system, and it has no single point of failure. A direct democracy is the perfect use for a distributed technology and infrastructure, thus the name "Distributed Democracy": a direct democracy managed in a distributed system.`,
  },

  {
    id: "i-dont-understand-this",

    question: "I don't understand any of this",
    text:
      "Athares just wants to make it easy to build groups where no one has to be the boss.",
  },
];
