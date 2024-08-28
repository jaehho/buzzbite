import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Text, useWindowDimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from  'expo-linear-gradient';
import LikeButton from './LikeButton';
import CommentModal from './CommentModal';
import ProfilePictureIcon from './ProfilePictureIcon';
import { GestureDetector } from 'react-native-gesture-handler';
import api from '../services/api'

export default function VideoScreen(props) {

  //video source for the post
  const videoSource = props.post.videoSource;
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [commentsVisable, setCommentsVisable] = useState(false);
  const [hasBeenViewed, sethasBeenViewed] = useState(false);

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
      setShowPause(true);
      } else {
      player.play();
      setIsPlaying(true);
      setShowPause(false);
      }
    }


  
    //used to autoplay current video
  useEffect(() => {
    if(props.activePostId !== props.post.id) {
      player.replay();
      player.pause();
      setIsPlaying(false);
      setShowPause(false);
      
    }
    if(props.activePostId === props.post.id) {
      player.play();
      setIsPlaying(true);
      setShowPause(false);
      if(!hasBeenViewed) {
        console.log('sending api view for:', props.post.id);
        api.post('/content/watch-history/', {
          video_id: props.post.id,
        }).then((response) => {
          console.log("watch history response", response.data);
        }).catch((error) => {
          console.log("watch history error", error);
        });
        sethasBeenViewed(true);
        
      }
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
    <View style={[styles.container, {height: height-60}]}>
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
          {showPause && <Ionicons name="play" size={40} color="rgba(255, 255, 255, 0.6)" style = {{position: 'absolute', alignSelf: 'center', top: '50%'}}/>}
          <SafeAreaView style = {{flex: 1, padding: 10}}>
            <View style = {styles.footer}>

              <View style = {styles.leftColumn}>
                <Text style = {styles.profile}>{props.post.username}</Text>
                <Text style = {styles.caption}>{props.post.caption}</Text>
              </View>
            

              <View style = {styles.rightColumn}>
                 <ProfilePictureIcon user_id = {props.post.user_id} imageUrl = {props.post.profile_picture}/>
                 <LikeButton likes={props.post.likes}/>
                 <Pressable onPress = {startComments}>
                  <MaterialCommunityIcons name="comment-outline" size={30} color="white" />
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
    paddingLeft: 10,
    paddingRight: 0,
    paddingBottom: 20,
    flexDirection: 'row', 
    alignItems: 'flex-end', 

  },
  rightColumn: {
    gap: 10,
    justifyContent: 'flex-end',
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
