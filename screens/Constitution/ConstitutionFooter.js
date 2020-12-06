import React, { useGlobal } from "reactn";

import { Text, TouchableOpacity, StyleSheet } from "react-native";
import * as RootNavigation from "../../navigation/RootNavigation";
import { Feather } from "@expo/vector-icons";

export default function ConstitutionFooter({ belongsToCircle }) {
  const [activeCircle] = useGlobal("activeCircle");
  const [user] = useGlobal("user");

  const goToCreateRevision = () => {
    RootNavigation.navigate("createRevision", { circle: activeCircle });
  };

  // user is not logged in
  if (!user || !belongsToCircle) {
    return null;
  }

  // circle is selected, user is logged in, AND they are a member of this circle
  return (
    <TouchableOpacity style={styles.footer} onPress={goToCreateRevision}>
      <Feather name="plus" color="#FFFFFF" size={25} style={styles.icon} />
      <Text style={styles.footerText}>Draft New Amendment</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#2f3242",
    height: "10%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 3,
  },
  footerText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "SpaceGrotesk",
  },
  icon: {
    marginRight: 25,
  },
});
