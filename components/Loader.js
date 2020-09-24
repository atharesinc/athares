import React, { useState, useEffect, useRef } from "react";
import { Animated, Platform, Easing } from "react-native";
import Svg, { G, Path, Circle } from "react-native-svg";

/* SVGR has dropped some elements not supported by react-native-svg: style */

const AnimatedG = Animated.createAnimatedComponent(G);

export default function SvgComponent({ size = 150, ...props }) {
  const rotation = useRef(new Animated.Value(0));
  const [offset] = useState(0);
  const anim = useRef(
    Animated.loop(
      Animated.timing(rotation.current, {
        useNativeDriver: Platform.OS !== "web",
        duration: 2000,
        toValue: 1,
        easing: Easing.linear,
      })
    )
  );

  useEffect(() => {
    anim.current.start();
  }, []);

  const offsetAndroid = offset;

  const [pivotX, pivotY] = [250, 250];

  return (
    <Svg
      id="prefix__ekhk77smbmil1"
      viewBox="0 0 500 500"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      height={size || "100%"}
      width={size || "100%"}
      {...props}
    >
      <G
        id="prefix__ekhk77smbmil2"
        fill="#FFF"
        stroke="#282a38"
        strokeWidth={8}
        strokeMiterlimit={10}
      >
        <Path
          id="prefix__ekhk77smbmil3"
          d="M142.634 339.819h40.348l66.995-133.005 31.199 60.755h40.393l-71.592-143.185z"
        />
        <Path
          id="prefix__ekhk77smbmil4"
          d="M297.238 304.022l17.077 35.797h41.051l-18.39-35.797z"
        />
      </G>
      <G id="prefix__ekhk77smbmil5">
        <Path
          id="prefix__ekhk77smbmil6"
          d="M250 51.667C140.463 51.667 51.667 140.463 51.667 250c0 109.536 88.796 198.333 198.333 198.333 109.536 0 198.333-88.797 198.333-198.333 0-109.537-88.797-198.333-198.333-198.333zM250 429c-98.859 0-179-80.143-179-179 0-98.859 80.141-179 179-179 98.857 0 179 80.141 179 179 0 98.857-80.143 179-179 179z"
          fill="#FFF"
          stroke="#282a38"
          strokeWidth={8}
          strokeMiterlimit={10}
        />
        <G transform={`translate(${pivotX}, ${pivotY})`}>
          <AnimatedG
            style={{
              transform: [
                {
                  translateX: -offsetAndroid,
                },
                {
                  rotate: rotation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
                {
                  translateX: offsetAndroid,
                },
              ],
            }}
          >
            <Circle
              id="prefix__ekhk77smbmil7"
              r={24.667}
              transform="translate(188.667)"
              fill="#FFF"
              stroke="#282a38"
              strokeWidth={8}
              strokeMiterlimit={10}
            />
          </AnimatedG>
        </G>
      </G>
    </Svg>
  );
}
