import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, Pressable } from 'react-native';
import { router, useRouter } from 'expo-router';
import VideoPreview from '../components/VideoPreview';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';



const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns;

const ProfileScreen = (user_id: any, isSelf: boolean) => {

  const [profilePicture, setProfilePicture] = useState<string>('');
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [posts, setPosts] = useState<Array<any>>([]);
  const [username, setUsername] = useState<string>('');

  //idk how this works lol
  const [self, setIsSelf] = useState<boolean>(user_id.isSelf);

  const id = user_id.user_id;

  const fetchUserData = async () => {
    try 
    {
      console.log("user_id", user_id);
      const response = await api.get(`/users/profiles/${id}/`, {
      });
      return response.data;
        
    } 
    catch (error) { 
        console.log("profile error", error);
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
        <VideoPreview post = {item} handleVideoPress={handleVideoPress}/>
      </View>
    );
  };

  
  const handleVideoPress = (index: any) => {
    //@ts-ignore
    router.push({ pathname: '/ProfileVideos', 
      params: {index: index, posts: JSON.stringify(posts)}});
  };

  useEffect(() => {
    fetchUserData().then((data) => {
      setProfilePicture(data.profile_picture);
      setFollowers(data.followers);
      setFollowing(data.following);
      setPosts(data.video_ids);
      setUsername(data.user.username);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
  {self && (<View style={styles.editProfileButton}>
      <Pressable
        onPress={() => {router.navigate('/editprofile');
        }}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </Pressable>
    </View>)}
      <FlatList
        data={formatData(posts, numColumns)}
        style={styles.list}
        renderItem={({item, index}) => { if (item.empty) {
          console.log('empty');
          return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
          <View style={styles.item}>
            <VideoPreview post = {item} index = {index} handleVideoPress={handleVideoPress}/>
            
          </View>
        );}
      }
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
  },
  pressed: {
    opacity: 0.5,
  },
  editProfileButton: {
    padding: 10,
    backgroundColor: '#0095f6',
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default ProfileScreen;
