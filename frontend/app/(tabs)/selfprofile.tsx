import React, {useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, Pressable } from 'react-native';
import { router } from 'expo-router';
import VideoPreview from '../../components/VideoPreview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';




const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns;

const ProfileScreen: React.FC = () => {

  const [profilePicture, setProfilePicture] = useState<string>('');
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [posts, setPosts] = useState<Array<any>>([]);


  const {user, user_id} = useContext(AuthContext);
  

  const fetchUserData = async () => {
    try 
    {
      const response = await api.get(`users/profiles/${user_id}/`, {
        // headers: {
        //   'Content-Type': 'application/json',
        // },
      });
      return response.data;
        
    } 
    catch (error) { 
        console.log("self profile error", error);
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
      setPosts(data.video_ids);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profilePicture} />}
        <View style={styles.headerTextContainer}>
        <Text style={styles.stat}>@{user}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.stat}>{followers} Followers</Text>
            <Text style={styles.stat}>{following} Following</Text>
          </View>


      </View>
      
      </View>
      <View style={styles.editProfileButton}>
        <Pressable
          onPress={() => {router.navigate('/editprofile');
          }}
    
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </Pressable>
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
