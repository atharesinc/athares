import React, { useGlobal } from "reactn";
import * as RootNavigation from "../../navigation/RootNavigation";

import { fromNow } from "../../utils/transform";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import AsyncImage from "../../components/AsyncImage";
// import MeshStore from "../../utils/meshStore";

const SingleSearchItem = ({ item, category, ...props }) => {
  const [, setActiveCircle] = useGlobal("activeCircle");
  const [, setActiveChannel] = useGlobal("activeChannel");
  const [, setActiveRevision] = useGlobal("activeRevision");
  const [, setActiveAmendment] = useGlobal("activeAmendment");
  const [, setActiveViewUser] = useGlobal("activeViewUser");
  const [, setShowSearch] = useGlobal("showSearch");
  // const [, setSearchedCircles] = useGlobal("searchedCircles");

  // on searching for a circle,
  // add it to list of searched circles so user has something to look at if logged out
  // useEffect(() => {
  // if (activeCircle) {
  //   console.log("adding this circle", activeCircle);
  //   // let searchedCircles = await MeshStore.getItem("searched_circles")
  //   // if our list of searches doesnt include the one we just searched for add it
  //   if (!searchedCircles.includes(activeCircle)) {
  //     const newArr = [activeCircle, ...searchedCircles];
  //     setSearchedCircles(newArr);
  //     MeshStore.setItem("searched_circles", JSON.stringify(newArr));
  //   }
  // }
  // }, [activeCircle]);

  // useEffect(() => {
  //   if (activeChannel) {
  //     RootNavigation.navigate("channel");
  //   }
  // }, [activeChannel]);

  // useEffect(() => {
  //   if (activeRevision) {
  //     console.log("update to active revision", activeRevision);
  //     RootNavigation.navigate("viewRevision");
  //   }
  // }, [activeRevision]);

  // useEffect(() => {
  //   if (activeAmendment) {
  //     RootNavigation.navigate("constitution");
  //   }
  // }, [activeAmendment]);

  // useEffect(() => {
  //   if (activeViewUser) {
  //     RootNavigation.navigate("viewOtherUser");
  //   }
  // }, [activeViewUser]);

  const navigate = () => {
    const { id } = item;

    if (item) {
      switch (category) {
        case "circles":
          setActiveCircle(id);
          break;
        case "channels":
          setActiveCircle(item.circle.id);
          setActiveChannel(id, () => {
            RootNavigation.navigate("channel");
          });

          break;
        case "amendments":
          setActiveCircle(item.circle.id);
          setActiveAmendment(id, () => {
            RootNavigation.navigate("constitution");
          });

          break;
        case "revisions":
          setActiveCircle(item.circle.id);
          setActiveRevision(id, () => {
            RootNavigation.navigate("viewRevision");
          });

          break;
        case "users":
          setActiveViewUser(id, () => {
            RootNavigation.navigate("viewOtherUser");
          });

          break;
        default:
          break;
      }
      setShowSearch(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.suggestionItem}
      key={item.id}
      onPress={navigate}
      data-id={item.id}
    >
      {category === "users" ? (
        <View style={styles.suggestionItemUser}>
          <AsyncImage
            source={{ uri: item.icon }}
            style={styles.userIcon}
            placeholderColor={"#3a3e52"}
          />
          <Text style={styles.suggestionText}>
            {item.firstName + " " + item.lastName}
          </Text>
          {item.uname && <Text>- {item.uname}</Text>}
        </View>
      ) : (
        <View>
          <Text style={styles.suggestionText}>
            {item[props.searchOn] +
              (category !== "circles" ? " - " + item.circle.name : "")}
          </Text>
          {category !== "circles" && (
            <Text style={[styles.suggestionText, styles.smaller]}>
              {fromNow(item.createdAt)}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SingleSearchItem;

const styles = StyleSheet.create({
  suggestionItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#FFFFFFb7",
    flexDirection: "row",
  },
  suggestionItemUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 16,
    color: "#FFFFFFb7",
    fontFamily: "SpaceGrotesk",
  },
  smaller: {
    fontSize: 12,
  },
  userIcon: {
    height: 30,
    width: 30,
    marginRight: 15,
  },
});
