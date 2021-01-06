import React, { useEffect, useState, useRef } from "reactn";
import { View, StyleSheet, Platform } from "react-native";

import { unixTime } from "../../utils/transform";

export default function Countdown({ createdAt, expires }) {
  const [timeLeft, setTimeLeft] = useState(100);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (expires && createdAt && unixTime() < unixTime(expires)) {
      intervalRef.current = setInterval(
        () => {
          if (timeLeft <= 0) {
            clearInterval(intervalRef.current);
            return;
          }

          let percentLeft =
            (unixTime(expires) - unixTime()) /
            (unixTime(expires) - unixTime(createdAt));
          setTimeLeft(percentLeft * 100);
        },

        1000
      );
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <View
      style={[
        styles.bar,
        {
          width: timeLeft + "%",
        },
      ]}
    ></View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 1,
    borderColor: "#00DFFC",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#00DFFC",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.55,
        shadowRadius: 12,
      },
      web: {
        shadowColor: "#00DFFC",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.55,
        shadowRadius: 12,
      },
    }),
  },
});
