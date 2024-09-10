import {View, Pressable, StyleSheet, Dimensions} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 3;

const VideoPreview = (props) => {
    const videoSource = props.post.videoSource;
    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
    });

    return (
        <View style={{flex:1, backgroundColor: '#D3D3D3'}}>
            <VideoView 
                player={player}
                style ={{height: '100%', width: itemWidth-1}}
                contentFit = 'cover' 
                allowsFullscreen = {false}
                allowsPictureInPicture = {false}
                nativeControls = {false}/>
        </View>
    );
}

export default VideoPreview;