import React, { useState, useEffect } from "reactn";
import { Animated } from "react-native";

export default function FadeInView(props) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 1000,
    }).start();
  }, []);

  return (
    <Animated.View
      {...props}
      style={{
        opacity: fadeAnim,
        ...props.style,
      }}
    >
      {props.children}
    </Animated.View>
  );
}
