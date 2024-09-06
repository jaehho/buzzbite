import { View, Text, StyleSheet, Pressable, Image} from 'react-native';

const RestaurantOverlay = ({ restaurant }) => {
    return (
        <View style = {styles.container}>
            <Pressable>
                <Image source={{ uri: restaurant.image }} style={styles.image} resizeMode="cover"/>
            </Pressable>
            <View>
                <Text style = {styles.restaurantText}>{restaurant.restaurantName}</Text>
                <Text style = {styles.foodItemText}>{restaurant.foodItem}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 200,
        borderWidth: 1,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: '#ffffff',
        alignSelf: 'flex-end',
        
    },
    restaurantText: {
        color: 'white',
        fontWeight: 'bold',
    },
    foodItemText: {
        color: 'white',
        fontSize: 10,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
    }
});

export default RestaurantOverlay;