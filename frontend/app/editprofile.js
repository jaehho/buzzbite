import React from 'react';
import { View, TextInput, Button, StyleSheet, Text, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

const EditProfileScreen = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();

    const onSubmit = data => {
        console.log(data);
        // Handle profile update logic here
        router.back(); // Navigate back after updating
    };

    return (
        <SafeAreaView contentContainerStyle={styles.container}>
            <Pressable onPress={() => router.back()}>
                <AntDesign name="left" size={24} color="black" />
            </Pressable>            
            <View>
                <Text style={styles.label}>Name</Text>
                <Controller
                    control={control}
                    name="name"
                    defaultValue=""
                    rules={{ required: 'Name is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

                <Text style={styles.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    defaultValue=""
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: 'Invalid email address'
                        }
                    }}
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
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

                <Text style={styles.label}>Phone</Text>
                <Controller
                    control={control}
                    name="phone"
                    defaultValue=""
                    rules={{
                        required: 'Phone number is required',
                        pattern: {
                            value: /^[0-9]+$/,
                            message: 'Must be a valid phone number'
                        }
                    }}
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
                {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

                <Text style={styles.label}>Bio</Text>
                <Controller
                    control={control}
                    name="bio"
                    defaultValue=""
                    rules={{ maxLength: { value: 250, message: 'Bio cannot exceed 250 characters' } }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            multiline
                            numberOfLines={4}
                        />
                    )}
                />
                {errors.bio && <Text style={styles.error}>{errors.bio.message}</Text>}

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
    label: {
        fontSize: 16,
        marginBottom: 8,
        margin: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 4,
        margin: 20,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 4,
        textAlignVertical: 'top',
    },
    error: {
        fontSize: 14,
        color: 'red',
        marginBottom: 8,
    },
});

export default EditProfileScreen;
