import { Link } from 'expo-router';
import React from 'react';
import { View, Pressable, StyleSheet, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const NavBar = () => {
    return (
        <View style={styles.container}>
            <Link href="/Splash" asChild>
            <Pressable style={styles.button} onPress={() => console.log('Home button pressed')}>
                <Icon name="home" size={20} color="white" />
            </Pressable>
            </Link>
            <Link href="/profile" asChild>
            <Pressable style={styles.button} onPress={() => console.log('Profile button pressed')}>
                <Icon name="user" size={20} color="white" />
            </Pressable>
            </Link>
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
