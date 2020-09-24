import React from "reactn";
import { Animated } from "react-native";

export default class FadeInView extends React.Component {
  constructor() {
    super();

    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 1000,
    }).start();
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View
        {...this.props}
        style={{
          ...this.props.style,
          opacity: fadeAnim,
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
