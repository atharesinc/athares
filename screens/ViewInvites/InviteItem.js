import React, { useGlobal } from "reactn";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { fromNow } from "../../utils/transform";

export default function InviteItem({
  data: { circle, id, createdAt, inviter },
  ...props
}) {
  const [activeTheme] = useGlobal("activeTheme");

  const accept = () => {
    props.accept(id, circle.id);
  };

  const reject = () => {
    props.reject(id);
  };

  return (
    <TouchableOpacity style={styles.menuLink} {...props}>
      <View>
        <Text style={styles.header}>{circle.name}</Text>
        <Text style={styles.disclaimer}>
          {inviter.firstName +
            " " +
            inviter.lastName +
            ", " +
            fromNow(createdAt)}
        </Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={accept}>
          <Feather
            style={styles.icon}
            name={"check-circle"}
            color={activeTheme.COLORS.GREEN}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={reject}>
          <Feather
            style={styles.icon}
            name={"x-square"}
            color={activeTheme.COLORS.RED}
            size={25}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFFb7",
    marginVertical: 10,
  },
  icon: {
    marginRight: 20,
    marginLeft: 20,
  },
  header: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk",
  },
  disclaimer: {
    fontSize: 14,
    color: "#FFFFFFb7",
    fontFamily: "SpaceGrotesk",
  },
  row: {
    flexDirection: "row",
  },
});
