import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, useWindowDimensions, Pressable} from 'react-native';
import { useCallback, useState, useRef, useEffect, } from 'react';
import VideoScreen from '../components/VideoScreen';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import {router} from 'expo-router';



export default function ProfileVideos() {

  const [activePostId, setActivePostId] = useState(-1);
  const { index, posts } = useLocalSearchParams();

  const { height } = useWindowDimensions();

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

// do nothing for now
  const onEndReached = useCallback(() => {

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
      <FlatList data={JSON.parse(posts)}
                renderItem={({item}) => <VideoScreen post={item} activePostId ={activePostId} hasNavBar={false}/>}
                keyExtractor={( {id}, index )=> index.toString()}
                pagingEnabled
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                onEndReached={()=>{}}
                onEndReachedThreshold={1}
                getItemLayout={(data, index) => (
                  { length: height, offset: height * index, index }
                )}
                initialScrollIndex= {index}

      />

        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '10%',
          }}
        />
        <Pressable onPress={() => router.back()} style = {styles.backButton}>
            <AntDesign name="left" size={24} color="white" />
        </Pressable>
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
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
  }
});
