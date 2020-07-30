import React, { useGlobal } from "reactn";
import { Animated } from "react-native";
import SideMenu from "react-native-side-menu";

import Menu from "./Menu";

export default function Drawer(props) {
  const [isMenuOpen, setIsMenuOpen] = useGlobal("isMenuOpen");
  const [isMobile] = useGlobal("isMobile");
  const [dimensions] = useGlobal("dimensions");

  const handleClose = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  const drawerWidth = isMobile ? Math.round(dimensions.width * 0.8) : 300;

  const animationStyle = (value) => {
    return {
      transform: [
        {
          scale: value.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0.95],
          }),
        },
        {
          translateX: value,
        },
      ],
    };
  };
  const animationFunction = (prop, value) => {
    return Animated.spring(prop, {
      useNativeDriver: true,
      toValue: value,
      friction: 8,
      tension: 50,
    });
  };
  return (
    <SideMenu
      isOpen={isMenuOpen}
      openMenuOffset={drawerWidth}
      onChange={handleClose}
      menu={<Menu />}
      bounceBackOnOverdraw={false}
      animationFunction={animationFunction}
      animationStyle={animationStyle}
    >
      {props.children}
    </SideMenu>
  );
}
