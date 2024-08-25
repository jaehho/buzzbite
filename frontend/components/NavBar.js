import { Link, router } from 'expo-router';
import React from 'react';
import { View, Pressable, StyleSheet, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { AuthContext } from '../context/AuthContext';
const NavBar = () => {
    return (
        <View style={styles.container}>

            <Pressable style={styles.button} onPress={() => router.navigate('/(tabs)/home')}>
                <Icon name="home" size={20} color="white" />
            </Pressable>

            <Pressable style={styles.button} onPress={() => router.navigate('/(tabs)/selfprofile')}>
                <Icon name="user" size={20} color="white" />
            </Pressable>
            <Pressable style={styles.button} onPress={() => console.log('Posts button pressed')}>
                <Icon name="file-text" size={20} color="white" />
            </Pressable>
        </View>
    );
};

const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'top-center',
        height: 60,
        backgroundColor: 'black',
        borderColor: '#36454F', 
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    button: {
        padding: 10,
    },
};

export default NavBar;
