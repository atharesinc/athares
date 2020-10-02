import React, { useState, useRef, useEffect, useGlobal } from "reactn";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
// import InviteUser from "../../components/InviteUser";
import DisclaimerText from "../../components/DisclaimerText";
import AddTag from "../../components/AddTag";
import GlowButton from "../../components/GlowButton";
import Loader from "../../components/Loader";
import { Feather } from "@expo/vector-icons";
import Suggestions from "./Suggestions";

import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";

import { useLazyQuery, useMutation } from "@apollo/client";
import {
  //  ADD_USER_TO_CIRCLE,
  CREATE_INVITE,
} from "../../graphql/mutations";
import { SEARCH_FOR_USER_NOT_IN_CIRCLE } from "../../graphql/queries";
import { sha } from "../../utils/crypto";

export default function AddUser(props) {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [activeCircle] = useGlobal("activeCircle");
  const inputRef = useRef();
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [user] = useGlobal("user");

  const [search, { loading, data }] = useLazyQuery(
    SEARCH_FOR_USER_NOT_IN_CIRCLE
  );
  // const [addUserToCircle] = useMutation(ADD_USER_TO_CIRCLE);
  const [inviteUser] = useMutation(CREATE_INVITE);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    // don't re-search if they've only just started typing
    if (input.trim() !== "" && input.trim().length > 2) {
      search({
        variables: {
          text: input || "",
          circle: activeCircle,
          user,
        },
      });
    }
  }, [input]);

  const removeTag = (id) => {
    const newTags = tags.filter((t) => t.id !== id);
    setTags(newTags);
  };

  const addTag = (newTag) => {
    const newTags = [...tags, newTag];
    setTags(newTags);
    setInput("");

    // refocus the input
    inputRef.current.focus();
  };

  const submit = async () => {
    setLoadingInvites(true);
    console.log(tags);
    // add each user to circle

    if (tags.length === 0) {
      return;
    }

    try {
      let invites = tags.map((u) => {
        return inviteUser({
          variables: {
            me: user,
            other: u.id,
            circle: activeCircle,
            hash: sha(
              JSON.stringify({
                inviter: user,
                invitee: u.id,
                date: new Date().toJSON().substring(0, 10),
              })
            ),
          },
        });
      });

      let responses = await Promise.allSettled(invites);

      let failedInvites = responses.filter((r) => r.status === "rejected");

      if (failedInvites.length !== 0) {
        if (
          failedInvites[0]?.reason?.graphQLErrors[0]?.details?.dateHash.includes(
            "Can't insert data. Field 'dateHash' has unique values"
          )
        ) {
          console.log(
            "User just tried to invite someone they already invited. Pretend as normal."
          );
        } else {
          throw new Error(failedInvites[0].reason);
        }
      }

      Alert.alert(
        `${tags.length > 1 ? "Users Added" : "User Added"}`,
        `${tags.length > 1 ? "These users have" : "This user has"} been added.`
      );
      props.navigation.goBack(null);
    } catch (err) {
      console.error(new Error(err));
      //     Alert.alert("Error", "There was an error inviting users.");
    } finally {
      setLoadingInvites(false);
    }
  };

  if (loadingInvites) {
    return <CenteredLoaderWithText />;
  }
  console.log(data, activeCircle);
  let suggestions = [];
  // if we have ay results, filter out suggestions for people we've already added
  if (data && data.usersList && data.usersList.items.length !== 0) {
    suggestions = data.usersList.items.filter(
      (s) => tags.findIndex((t) => t.id === s.id) === -1
    );
    console.log({ suggestions });
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.searchInputWrapper}>
          {/* Search Input */}
          <Feather
            name="search"
            size={15}
            color={"#FFFFFFb7"}
            numberOfLines={1}
            style={styles.searchIcon}
          />
          <TextInput
            value={input}
            style={styles.searchInput}
            onChangeText={setInput}
            placeholder={"Enter Search Text"}
            numberOfLines={1}
            placeholderTextColor={"#FFFFFFb7"}
            ref={inputRef}
          />
          {loading ? (
            <Loader size={20} style={styles.searchIcon} />
          ) : (
            <Feather
              name="x"
              size={20}
              color={"#00000000"}
              numberOfLines={1}
              style={styles.searchIcon}
            />
          )}
        </View>
        {/* Display Suggestions for Users to invite, if any */}
        {input.length > 2 && (
          // <SearchResults suggestions={suggestions} setTags={setTags} />
          <Suggestions suggestions={suggestions} addTag={addTag} />
        )}
        {/* Display list of users selected to invite */}
        <View style={styles.picker}>
          {tags.length !== 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.toText}>Invite:</Text>
              <ScrollView
                contentContainerStyle={styles.tagsList}
                horizontal={true}
              >
                {tags.map((t) => (
                  <AddTag key={t.id} {...t} removeTag={removeTag} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
      <View style={{ padding: 15 }}>
        <DisclaimerText
          grey
          text={`After pressing "Invite Users", the recipient(s) will be added automatically to this circle.\nInvitations are not subject to democratic process.`}
        />
        <GlowButton
          text="Invite Users"
          style={styles.marginTop}
          onPress={submit}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "space-between",
    width: "100%",
    flex: 1,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#2f3242",
  },
  searchIcon: {
    marginRight: 10,
    flex: 1,
  },
  searchInput: {
    color: "#FFFFFF",
    fontSize: 15,
    flex: 8,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
    fontFamily: "SpaceGrotesk",
  },
  picker: {
    flexDirection: "column",
    alignItems: "stretch",
    marginBottom: 20,
  },
  tagsList: {
    backgroundColor: "transparent",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  toText: {
    color: "#FFFFFF80",
    marginRight: 5,
    fontSize: 15,
  },
  marginTop: {
    marginTop: 15,
  },
});
