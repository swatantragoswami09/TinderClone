import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
} from "react-native";

import React, { useEffect, useState, useRef, useMemo } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const Deck = (props) => {
  const [result, setResult] = useState({});
  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ["-120deg", "0deg", "120deg"],
  });

  useEffect(() => {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }, []);

  useEffect(() => {
    const panResponder = PanResponder.create({
      // this function is call anytime user press the screen
      onStartShouldSetPanResponder: () => true,
      //
      onPanResponderMove: (event, gesture) => {
        // console.log(gesture)
        position.setValue({ x: gesture.dx, y: gesture.dy });
        // console.log("position=",position)
      },
      //
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else {
          resetPosition();
        }
      },
    });
    setResult(panResponder);
    // setResult(position);
    console.log("result-", result);
  }, []);
  const forceSwipe = (direction) => {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      onSwipeComplete(direction);
    });
  };
  const onSwipeComplete = (direction) => {
    const { onSwipeLeft, onSwipeRight, data } = props;
    const item = data[index];

    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    position.setValue({ x: 0, y: 0 });
    setIndex((prev) => prev + 1);
  };
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
    }).start();
  };
  const getCardStyle = () => {
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };
  const renderCards = () => {
    if (index >= props.data.length) {
      console.log("hiiiiiiiiiii ");
      return props.renderNoMoreCards();
    }

    return props.data
      .map((item, i) => {
        if (i < index) return null;

        if (i === index) {
          return (
            <Animated.View
              key={item.id}
              {...result.panHandlers}
              style={[getCardStyle(), styles.cardStyle]}
            >
              {props.renderCard(item)}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            key={item.id}
            style={[styles.cardStyle, { top: 10 * (i - index) }]}
          >
            {props.renderCard(item)}
          </Animated.View>
        );
      })
      .reverse();
  };
  return <View>{renderCards()}</View>;
};

export default Deck;

const styles = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    width: SCREEN_WIDTH,
  },
});
