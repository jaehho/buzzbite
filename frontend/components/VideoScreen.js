import { Video } from 'expo-av';
import { useEffect, useRef, useState, useCallback} from 'react';
import { StyleSheet, View, Pressable, Text, useWindowDimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import LikeButton from './LikeButton';
import CommentModal from './CommentModal';
import ProfilePictureIcon from './ProfilePictureIcon';
import api from '../services/api';
import RestaurantOverlay from './RestaurantOverlay';

export default function VideoScreen(props) {

  const videoSource = props.post.videoSource;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState({});
  const [shouldVideoReload, setShouldVideoReload] = useState(false);
  const isVideoReadyRef = useRef(false);
  const [reloadVideo, setReloadVideo] = useState(false);

  const potentiallyReloadVideo = useCallback(() => {
    setTimeout(() => {
      if (status.isLoaded == false) {
        setShouldVideoReload(true);
        console.log('reloading video:', videoSource);
      }
    }, 300);
  }, []);

  useEffect(() => {
    if (shouldVideoReload) {
      setShouldVideoReload(false);
    }
  }, [shouldVideoReload]);

  const { height } = useWindowDimensions();

  const playPause = async () => {
    if (isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
      setShowPause(true);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
      setShowPause(false);
    }
  };

  useEffect(() => {
    if (props.activePostId !== props.post.id) {
      videoRef.current.stopAsync();
      setIsPlaying(false);
      setShowPause(false);
    } else if (props.activePostId === props.post.id) {
      videoRef.current.playAsync();
      setIsPlaying(true);
      setShowPause(false);
      
      if (!hasBeenViewed) {
        // console.log('sending api view for:', props.post.id);
        api.post('/content/watch-history/', {
          video_id: props.post.id,
        }).then((response) => {
          // console.log("watch history response", response.data);
        }).catch((error) => {
          console.log("watch history error", error);
        });
        setHasBeenViewed(true);
      }

    }
  }, [props.activePostId]);

  useEffect(() => {
    potentiallyReloadVideo();
    // console.log( videoSource, status.isLoaded, "error: ", status.error);

  }, [status.isLoaded, reloadVideo]);


  const startComments = () => {
    setCommentsVisible(true);
  };

  const endComments = () => {
    setCommentsVisible(false);
  };


  return (
    <View style={[styles.container, { height: height - 60 }]}>
      
      {!reloadVideo ? <Video
        ref={videoRef}
        source={{ uri: videoSource }}
        style={styles.videoStyle}
        resizeMode = "cover"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
        onError = {error => console.log("video error", error)}

        onLoadStart={() => {
          potentiallyReloadVideo();
        }}

        onReadyForDisplay={(event) => {
          isVideoReadyRef.current = true;
        }}
      /> : <></>}
      <Pressable onPress={playPause} style={styles.content}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: '100%',
          }}
        />
        {showPause && <Ionicons name="play" size={40} color="rgba(255, 255, 255, 0.6)" style={{ position: 'absolute', alignSelf: 'center', top: '50%' }} />}
        <SafeAreaView style={{ flex: 1, padding: 10 }}>
          <View style={styles.footer}>
            <View style={styles.leftColumn}>
              <RestaurantOverlay restaurant = {{restaurantName: 'Wing Stop', foodItem: 'Wings', image: 'https://banner2.cleanpng.com/20180621/uxq/aaz03p269.webp'}} />
              <Text style={styles.profile}>{props.post.username}</Text>
              <Text style={styles.caption}>{props.post.caption}</Text>
            </View>
            <View style={styles.rightColumn}>
              <ProfilePictureIcon user_id={props.post.user_id} imageUrl={props.post.profile_picture} />
              <LikeButton likes={props.post.likes} video_id={props.post.id} />
              <Pressable onPress={startComments}>
                <MaterialCommunityIcons name="comment-outline" size={30} color="white" />
              </Pressable>
            </View>
          </View>
          <CommentModal
            visible={commentsVisible}
            onClose={endComments}
            comments={comments}
            onAddComment={(comment) => setComments([...comments, comment])}
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
    right: 0,
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
    flex: 1,
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
