import {useContext} from 'react';
import { View, TextInput, Button, StyleSheet, Text, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';


const schema = yup.object().shape({
    name: yup.string(),
    email: yup.string().email('Invalid email address'), 
    phone: yup.string().matches(/^[0-9]+$/, 'Must be a valid phone number'), 
    bio: yup.string().max(250, 'Bio cannot exceed 250 characters')
});


const EditProfileScreen = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const router = useRouter();

    const { user_id} = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            console.log(data);
            const response =await api.patch(`/users/profiles/${user_id}/`, data);
            // console.log(JSON.stringify(response.data));
            router.back(); 
        } catch (error) {
            console.error('Profile update failed:', error);
        }
    };

    const renderError = (error) => error && <Text style={styles.error}>{error.message}</Text>;

    return (
        <SafeAreaView style={styles.container}>
            <Pressable onPress={() => router.back()}>
                <AntDesign name="left" size={24} color="black" />
            </Pressable>            
            <View style={styles.form}>
                <Text style={styles.label}>Name</Text>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {renderError(errors.name)}

                <Text style={styles.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                        />
                    )}
                />
                {renderError(errors.email)}

                <Text style={styles.label}>Phone</Text>
                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="phone-pad"
                        />
                    )}
                />
                {renderError(errors.phone)}

                <Text style={styles.label}>Bio</Text>
                <Controller
                    control={control}
                    name="bio"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            multiline
                            numberOfLines={4}
                        />
                    )}
                />
                {renderError(errors.bio)}

                <Button title="Save Changes" onPress={handleSubmit(onSubmit)} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    form: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 4,
    },
    textArea: {
        textAlignVertical: 'top',
    },
    error: {
        fontSize: 14,
        color: 'red',
        marginBottom: 8,
    },
});

export default EditProfileScreen;
