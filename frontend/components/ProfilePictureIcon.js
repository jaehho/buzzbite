import React from 'react';
import { Pressable, Image, StyleSheet} from 'react-native';
import { router } from 'expo-router';

const ProfilePictureIcon = ({ imageUrl, user }) => {


    const handlePress = () => {
        router.navigate(`/(tabs)/${user}`);
    };
    return (
        <Pressable onPress={handlePress} style ={styles.profileImgContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover"/>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    profileImgContainer: {
        height: 35,
        width: 35,
        overflow: 'hidden',

      },
    image: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderRadius: 100,
        
        borderColor: '#ffffff',
    },
   
});
export default ProfilePictureIcon;