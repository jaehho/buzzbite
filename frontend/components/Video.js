import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Text, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from  'expo-linear-gradient';
import LikeButton from './LikeButton';
import CommentModal from './CommentModal';
import { GestureDetector } from 'react-native-gesture-handler';

export default function VideoScreen(props) {

  //video source for the post
  const videoSource = props.post.videoSource;
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [commentsVisable, setCommentsVisable] = useState(false);

  const [comments, setComments] = useState([]);


  const {height} = useWindowDimensions();

  //video player required for expo video
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play(); 
  });
  const [status, useStatus] = useState(player.status);

  const playPause = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
      } else {
      player.play();
      setIsPlaying(true);
      }

    }

    //used to autoplay current video
  useEffect(() => {
    if(props.activePostId !== props.post.id) {
      player.pause();
      setIsPlaying(false);
    }
    if(props.activePostId === props.post.id) {
      player.play();
      setIsPlaying(true);
    }
  }, [props.activePostId]);


  useEffect(() => {
    const subscription = player.addListener('playingChange', isPlaying => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  const startComments = () => {
    setCommentsVisable(true);
  }

  const endComments = () => {
    setCommentsVisable(false);
  }

  return (
    <View style={[styles.container, {height: height-50}]}>
      
        <VideoView
                ref={ref}
                style={styles.videoStyle}
                player={player}
                allowsFullscreen = {false}
                allowsPictureInPicture = {false}
                nativeControls = {false}
                contentFit = 'contain'
            />

        <Pressable onPress={playPause} 
          style = {styles.content}>
          <LinearGradient
            colors = {['transparent', 'rgba(0,0,0,0.8)']}
            style = {{  
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: '100%',
            }}
          />
          {!isPlaying && <Ionicons name="play" size={40} color="rgba(255, 255, 255, 0.6)" style = {{position: 'absolute', alignSelf: 'center', top: '50%'}}/>}
          <SafeAreaView style = {{flex: 1, padding: 10}}>
            <View style = {styles.footer}>

              <View style = {styles.leftColumn}>
                <Text style = {styles.profile}>Profile Name</Text>
                <Text style = {styles.caption}>{props.post.caption}</Text>
              </View>


              <View style = {styles.rightColumn}>
                  {/* <AntDesign name="heart" size={24} color="white" />
                  <Text style = {styles.iconFont}>{props.post.likes}</Text> */}
                 <LikeButton likes={props.post.likes}/>
                 <Pressable onPress = {startComments}>
                 <MaterialCommunityIcons name="comment-outline" size={24} color="white" />
                 </Pressable>
              </View >
            </View> 


            <CommentModal 
              visible = {commentsVisable}
              onClose = {endComments}
              comments = {comments}
              onAddComment = {(comment) => setComments([...comments, comment])}
              />
            </SafeAreaView> 
        </Pressable>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  videoStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  content: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    paddingRight: 0,
    paddingBottom: 30,
    flexDirection: 'row', 
    alignItems: 'flex-end', 

  },
  rightColumn: {
    marginTop: 'auto',
    gap: 10,
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftColumn: {
    flex:1
  },
  caption: {
    color: 'white',
    fontSize: 20,
  },
  profile: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconFont: {
    color: 'white',
    fontSize: 10,

  },

});
