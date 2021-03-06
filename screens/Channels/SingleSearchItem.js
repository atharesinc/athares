import React, { useGlobal } from "reactn";
import * as RootNavigation from "../../navigation/RootNavigation";

import { fromNow } from "../../utils/transform";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Keyboard,
} from "react-native";
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
  //   // let searchedCircles = await MeshStore.getItemSync("searched_circles")
  //   // if our list of searches doesnt include the one we just searched for add it
  //   if (!searchedCircles.includes(activeCircle)) {
  //     const newArr = [activeCircle, ...searchedCircles];
  //     setSearchedCircles(newArr);
  //     MeshStore.setItem("searched_circles", JSON.stringify(newArr));
  //   }
  // }
  // }, [activeCircle]);

  const navigate = () => {
    const { id } = item;

    if (item) {
      Keyboard.dismiss();
      switch (category) {
        case "circles":
          setActiveCircle(id);
          break;
        case "channels":
          setActiveCircle(item.circle.id);
          setActiveChannel(id, () => {
            RootNavigation.navigate("channel", {
              circle: item.circle.id,
              channel: id,
            });
          });

          break;
        case "amendments":
          setActiveCircle(item.circle.id);
          setActiveAmendment(id, () => {
            RootNavigation.navigate("constitution", { circle: item.circle.id });
          });

          break;
        case "revisions":
          setActiveCircle(item.circle.id);
          setActiveRevision(id, () => {
            RootNavigation.navigate("viewRevision", {
              circle: item.circle.id,
              revision: id,
            });
          });

          break;
        case "users":
          setActiveViewUser(id, () => {
            RootNavigation.navigate("viewOtherUser", { user: id });
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
          <View style={styles.userIcon}>
            <AsyncImage
              source={{ uri: item.icon }}
              style={styles.userIcon}
              placeholderColor={"#3a3e52"}
            />
          </View>
          <Text style={styles.suggestionText}>
            {item.firstName + " " + item.lastName}
          </Text>
          {item.uname && <Text>- {item.uname}</Text>}
        </View>
      ) : (
        <View>
          <Text style={styles.suggestionText}>
            {item[props.searchOn] +
              (category !== "circles" && item.circle
                ? " - " + item.circle.name
                : "")}
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
    flexDirection: "row",
  },
  suggestionItemUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
    marginLeft: 15,
  },
  smaller: {
    fontSize: 12,
  },
  userIcon: {
    height: 30,
    width: 30,
  },
});
