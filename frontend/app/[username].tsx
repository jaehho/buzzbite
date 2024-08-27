import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, Pressable } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { router, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';
import VideoPreview from '../components/VideoPreview';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';

interface UserProfile {
  profilePicture: string;
  followers: number;
  following: number;
  posts: Array<{
    id: string;
    caption: string;
    videoSource: string;
    likes: number;
  }>;
  username: string;
}

const mockUserData: UserProfile = {
  profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
  followers: 1200,
  following: 150,
  posts: [
    { id: '1', caption: 'Hello World!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4', likes: 10 },
    { id: '2', caption: 'My second post!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4', likes: 10  },
    { id: '3', caption: 'Another post!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4', likes: 10  },
    { id: '4', caption: 'Yet another post!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4', likes: 10  },
    { id: '5', caption: 'Post five!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4', likes: 10  },
    { id: '6', caption: 'Post six!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4', likes: 10  },
  ],
  username: 'testUser',
};


const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns;

const ProfileScreen: React.FC = () => {

  const [profilePicture, setProfilePicture] = useState<string>('');
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [posts, setPosts] = useState<Array<any>>([]);

  const { username } = useLocalSearchParams();

  
  

  const fetchUserData = async () => {
    try 
    {
      
      const response = await
        
        fetch(`http://localhost:8000/profile/?username=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        });

        const json = await response.json();
        // console.log(json);
        
        return json;
        
        
    } 
    catch (error) { 
        console.log("error", error);
        return mockUserData;
    }
  };

  const formatData = (data: any[], numColumns: number) => {
    if(data == null) {
      data = [];
    }
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.empty) {
      console.log('empty');
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item}>
        <VideoPreview post = {item}/>
      </View>
    );
  };

  useEffect(() => {
    fetchUserData().then((data) => {
      setProfilePicture(data.profile_picture);
      setFollowers(data.followers);
      setFollowing(data.following);
      setPosts(data.videos);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()} style = {styles.backButton}>
        <AntDesign name="left" size={24} color="black" />
      </Pressable>
      <View style={styles.header}>
        {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profilePicture} />}
        <View style={styles.headerTextContainer}>
        <Text style={styles.stat}>@{username}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.stat}>{followers} Followers</Text>
            <Text style={styles.stat}>{following} Following</Text>
          </View>
      </View>
      </View>
      <FlatList
        data={formatData(posts, numColumns)}
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    margin: 16,
    alignItems: 'flex-start',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 5,
  },
  headerTextContainer: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: 200,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  postImage: {
    width: '100%',
    height: '70%',
  },
  postContent: {
    fontSize: 12,
    textAlign: 'center',
  },
  backButton: {
    padding: 10,
  }
});

export default ProfileScreen;
