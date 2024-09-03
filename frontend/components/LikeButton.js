
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useState } from 'react';
import { Pressable, View, Button, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from '../services/api';


const LikeButton = (props) => {
  const liked = useSharedValue(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
      opacity: liked.value,
    };
  });

  const onLikedPress = async () => {
    setIsDisabled(true);
    liked.value = withSpring(liked.value ? 0 : 1);
    setIsLiked(!isLiked);
    setTimeout(() => { setIsDisabled(false); }, 500);
    const response = !isLiked ? await api.post(`/content/likes/`, {video_id: props.video_id}) : await api.delete(`/content/likes/`, {video_id: props.video_id});
    console.log(JSON.stringify(response.data));
  };

  return (
    <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}>
        <Pressable onPress={onLikedPress} disabled = {isDisabled}>
          <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
            <MaterialCommunityIcons
              name={"heart-outline"}
              size={32}
              color={"white"}
            />
          </Animated.View>

          <Animated.View style={fillStyle}>
            <MaterialCommunityIcons name={"heart"} size={32} color={"red"} />
          </Animated.View>
        </Pressable>
        <Text style={{color: 'white'}}>{props.likes+(isLiked ? 1 : 0)}</Text>
      </View>
  );
};

export default LikeButton;