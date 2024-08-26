import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList} from 'react-native';
import { useCallback, useState, useRef, useEffect } from 'react';
import VideoScreen from '../../components/Video';
import { SafeAreaProvider } from 'react-native-safe-area-context';



const samplePosts = [
  {
    videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/2.mp4',
    caption: "Caption Here",
    id: 1,
    likes: 10
    
  },
  {
   videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/1.mp4',
   caption: "Caption Here",
   id: 2,
   likes: 10
  },
  {
   videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/3.mp4',
   caption: "Caption Here",
   id: 3,
   likes: 10
  },
  {
   videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/4.mp4',
   caption: "Caption Here",
   id: 4,
   likes: 10
  },
  {
   videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4',
   caption: "Caption Here",
   id: 5,
   likes: 10
  },
  {
   videoSource: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
   caption: "Caption Here",
   id: 6,
   likes: 10
  },
];




export default function HomeScreen() {

  const [activePostId, setActivePostId] = useState(-1);
  const [posts, setPosts] = useState([]);
  
  const fetchPosts = async () => {
    const username = "testuser";
    try 
      {
        const response = await
        fetch(`http://localhost:8000/?username=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const json = await response.json();
        console.log("posts fetched from api");
        // console.log(json);
        if(json.length === 0) {
          throw new Error("no posts recieved");
        }
        setPosts(currentPosts => [...currentPosts, ...json]);

    } 
    catch (error) { 
      console.log("posts fetched from sample posts; error", error);
      setPosts(currentPosts => [...currentPosts, ...samplePosts]);
      return;
    }
      
  };

  //fetch posts on load
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setActivePostId(posts[0]?.id);
  }, []);


  const viewabilityConfigCallbackPairs= useRef([{
    viewabilityConfig: {itemVisiblePercentThreshold:99}, 
    onViewableItemsChanged: ({changed, viewableItems}) => {
      if (viewableItems.length >0 && viewableItems[0].isViewable) {
        setActivePostId(viewableItems[0].item.id);
      }
    }
  }
  ]);

  const onEndReached = useCallback(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList data={posts}
                renderItem={({item}) => <VideoScreen post={item} activePostId ={activePostId}/>}
                keyExtractor={( {id}, index )=> id.toString() + index.toString()}
                pagingEnabled
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                onEndReached={onEndReached}
                onEndReachedThreshold={1}
      />
    </View>
    
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
