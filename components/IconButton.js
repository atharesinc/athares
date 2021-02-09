import React, { memo } from "react";
import { TouchableOpacity } from "react-native";

import Feather from "@expo/vector-icons/Feather";

export default memo(function IconButton({ onPress, name, size, color }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Feather name={name} size={size} color={color} />
    </TouchableOpacity>
  );
});
