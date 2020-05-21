import { Animated } from "react-native";
import {
  TransitionSpecs,
  HeaderStyleInterpolators,
  CardStyleInterpolators,
} from "@react-navigation/stack";

export const pushTransition = (theme) => ({
  // set background color of all cards
  cardStyle: { backgroundColor: theme.COLORS.DARK + "BB", flex: 1 },

  gestureDirection: "horizontal",
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  // default slide in from right stack navigation, we're modifying this to fully push the prev card so it's not hiding underneath
  // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  cardStyleInterpolator: ({ current, next, inverted, layouts: { screen } }) => {
    const { multiply } = Animated;

    const translateFocused = multiply(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [screen.width, 0],
        extrapolate: "clamp",
      }),
      inverted
    );

    const translateUnfocused = next
      ? multiply(
          next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -screen.width],
            extrapolate: "clamp",
          }),
          inverted
        )
      : 0;

    const overlayOpacity = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.07],
      extrapolate: "clamp",
    });

    const shadowOpacity = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return {
      cardStyle: {
        transform: [
          // Translation for the animation of the current card
          { translateX: translateFocused },
          // Translation for the animation of the card on top of this
          { translateX: translateUnfocused },
        ],
      },
      overlayStyle: { opacity: overlayOpacity },
      shadowStyle: { shadowOpacity },
    };
  },
});
