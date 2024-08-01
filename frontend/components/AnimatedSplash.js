import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { Stack } from 'expo-router';

const AnimatedSplash = () => {

    const animation = useRef(null); 

    return (
        <View style={styles.container}>
            <LottieView
                ref={animation}
                source={require('../assets/lottie/bee.json')}
                autoPlay
                loop={false}
                onAnimationFinish={() => {}}    
                style = {{ 
                    width: 500,
                    height: 500,
                }}
                
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

export default AnimatedSplash;