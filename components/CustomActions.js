import PropTypes from "prop-types";
import React from "reactn";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Keyboard,
} from "react-native";

import {
  pickFileURIAsync,
  pickImageURIAsync,
  takePictureAsync,
} from "../utils/mediaUtils";
import { Feather } from "@expo/vector-icons";

export default function CustomActions(props) {
  const getImageUri = async () => {
    console.log("get images");
    try {
      Keyboard.dismiss();
      let uri = await pickImageURIAsync();
      console.log(uri);

      props.updateFile(uri);
    } catch (e) {
      console.error(new Error(e));
    }
  };

  const getPhoto = async () => {
    console.log("photos?");
    try {
      Keyboard.dismiss();
      let uri = await takePictureAsync();
      props.updateFile(uri);
    } catch (e) {
      console.error(new Error(e));
    }
  };

  const getFileUri = async () => {
    console.log("get files");
    try {
      Keyboard.dismiss();
      let uri = await pickFileURIAsync();
      console.log(uri);

      props.updateFile(uri);
    } catch (e) {
      console.error(new Error(e));
    }
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity style={[styles.wrapper]} onPress={getImageUri}>
        <Feather name="image" size={20} color={"#FFFFFF"} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.wrapper]} onPress={getPhoto}>
        <Feather name="camera" size={20} color={"#FFFFFF"} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.wrapper]} onPress={getFileUri}>
        <Feather name="paperclip" size={20} color={"#FFFFFF"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#2f3242",
    marginLeft: 10,
  },
  wrapper: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions.defaultProps = {
  onSend: () => {},
  options: {},
  renderIcon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

CustomActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  renderIcon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
};
