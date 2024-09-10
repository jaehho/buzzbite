import { View, Text, Image, StyleSheet, FlatList, Dimensions, Pressable } from 'react-native';
import { router, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import ProfileScreen from '../components/ProfileScreen';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function SelfProfile() {
  const { user_id } = useLocalSearchParams();
  return (
    <>

      <ProfileScreen user_id={user_id}/>
      <Pressable onPress={() => router.back()} style = {styles.backButton}>
        <AntDesign name="left" size={24} color="black" />
      </Pressable>
     </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
  }
});