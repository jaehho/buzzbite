import { Link } from 'expo-router';
import React from 'react';
import { View, Pressable, StyleSheet, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const NavBar = () => {
    return (
        <View style={styles.container}>
            <Link href="/Splash" asChild>
            <Pressable style={styles.button} onPress={() => console.log('Home button pressed')}>
                <Icon name="home" size={20} color="#333" />
            </Pressable>
            </Link>
            <Link href="/profile" asChild>
            <Pressable style={styles.button} onPress={() => console.log('Profile button pressed')}>
                <Icon name="user" size={20} color="#333" />
            </Pressable>
            </Link>
            <Pressable style={styles.button} onPress={() => console.log('Posts button pressed')}>
                <Icon name="file-text" size={20} color="#333" />
            </Pressable>
        </View>
    );
};

const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 50,
        backgroundColor: 'black',
        borderColor: 'grey', 
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    button: {
        padding: 10,
    },
};

export default NavBar;
