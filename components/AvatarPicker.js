import React, { memo } from "reactn";
import { Image, TouchableOpacity, StyleSheet, View } from "react-native";
import { pickImageURIAsync } from "../utils/mediaUtils";

export default memo(function AvatarPicker({
  rounded = false,
  uri = null,
  ...props
}) {
  const changeImage = async () => {
    let res = await pickImageURIAsync();
    if (props.onImageChange) {
      props.onImageChange(res);
    }
  };

  const source = uri
    ? { uri }
    : require("../assets/images/Athares-logo-small-white.png");

  return (
    <TouchableOpacity style={[styles.previewTouch]} onPress={changeImage}>
      <View style={[styles.previewView, rounded ? styles.rounded : {}]}>
        <Image
          source={source}
          style={[styles.preview, rounded ? styles.noBorder : {}]}
        />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  preview: {
    height: 150,
    width: 150,
    resizeMode: "stretch",
    padding: 0,
    margin: 0,
  },
  rounded: {
    borderRadius: 9999,
    borderColor: "#FFFFFF",
    borderWidth: 5,
  },
  noBorder: {
    borderColor: "transparent",
    borderWidth: 0,
  },
  previewTouch: {
    height: 150,
    width: 150,
    padding: 0,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  previewView: {
    height: 150,
    width: 150,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#2F3242",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: 3,
  },
});
