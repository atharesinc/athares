import React from "reactn";
import { Animated } from "react-native";

export default class HeightOpenView extends React.Component {
  constructor() {
    super();

    this.state = {
      heightAnim: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.heightAnim, {
      useNativeDriver: true,
      toValue: this.props.style.height,
      duration: 250,
    }).start();
  }
  componentWillUnmount() {
    Animated.timing(this.state.heightAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 250,
    }).start();
  }
  render() {
    let { heightAnim } = this.state;

    return (
      <Animated.View
        {...this.props}
        style={{
          ...this.props.style,
          height: heightAnim,
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
