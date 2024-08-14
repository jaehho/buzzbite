import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, Button } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { router } from 'expo-router';
import VideoPreview from './VideoPreview';

interface UserProfile {
  profilePicture: string;
  followers: number;
  following: number;
  posts: Array<{
    id: string;
    caption: string;
    videoSource: string;
  }>;
  username: string;
}

const mockUserData: UserProfile = {
  profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
  followers: 1200,
  following: 150,
  posts: [
    { id: '1', caption: 'Hello World!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4' },
    { id: '2', caption: 'My second post!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4' },
    { id: '3', caption: 'Another post!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4' },
    { id: '4', caption: 'Yet another post!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4' },
    { id: '5', caption: 'Post five!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4' },
    { id: '6', caption: 'Post six!', videoSource: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-videos/5.mp4' },
    // More posts...
  ],
  username: 'testUser',
};



const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns;

const ProfileScreen: React.FC = () => {
  const { profilePicture, followers, following, posts, username } = mockUserData;

  const fetchUserData = async () => {
    try 
    {const response = await
        fetch("http://localhost:8000/login/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username}),
        });
        const json = await response.json();
        console.log(json);
        console.log("positive login");
    } 
    catch (error) { 
        console.log("error");
    }
  };

  const formatData = (data: any[], numColumns: number) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        <View style={styles.statsContainer}>
          <Text style={styles.stat}>{followers} Followers</Text>
          <Text style={styles.stat}>{following} Following</Text>
        </View>
      </View>
      <FlatList
        data={formatData(posts, numColumns)}
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
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
    height: 200, // approximate a square
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
});

export default ProfileScreen;
