import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, ActivityIndicator, Text} from 'react-native';
import { useCallback, useState, useRef, useEffect, } from 'react';
import VideoScreen from '../../components/Video';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import api from '../../services/api';



export default function HomeScreen() {

  const [activePostId, setActivePostId] = useState(-1);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try 
      {
        const response = await api.get(`/content/videos/`);
        // console.log(response.data);
        console.log(response.status);
        if(response.data.length === 0) {
          throw new Error("no posts recieved");
        }
        setPosts(currentPosts => [...currentPosts, ...response.data]);

    } 
    catch (error) { 
      console.log("error fetching videos", error);
      
      setPosts();
    }
      
  };

  //fetch posts on load
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if(posts) {
      setActivePostId(posts[0]?.id);
    }
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

  if(!posts || posts.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
        <Text style = {styles.errorText}>Hang on! We're working hard to retrive your videos, try again shortly!</Text>
        <ActivityIndicator size="large" color="white"/>
      </View>
    );
  };

  return (
    <SafeAreaProvider>  
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlatList data={posts}
                renderItem={({item}) => <VideoScreen post={item} activePostId ={activePostId}/>}
                keyExtractor={( {id}, index )=> index.toString()}
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
  errorText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  }
});
