import React from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useForm, Controller } from 'react-hook-form';

const Register = () => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const handleRegister = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/register/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      console.log(response.status);
      console.log(json);

      if (response.status === 200) {
        Alert.alert('Registration Successful', 'You have successfully registered.');
        router.navigate('/login');
      } else {
        Alert.alert('Registration Failed', json.error || 'An error occurred during registration.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to register.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.navigate('/login')}>
        <AntDesign name="left" size={24} color="black" />
      </Pressable>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <Controller
          control={control}
          rules={{ required: 'Username is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
            />
          )}
          name="username"
        />
        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Enter a valid email address',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
          name="email"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          rules={{ required: 'Password is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <View style={isValid ? styles.registerButtonEnabled : styles.registerButtonError}>
          <Pressable
            onPress={handleSubmit(handleRegister)}
            disabled={!isValid}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={isValid ? styles.registerTextEnabled : styles.registerTextError}>Register</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  registerButtonEnabled: {
    padding: 10,
    backgroundColor: '#0095f6',
    fontWeight: 'bold',
    marginVertical: 5,
    borderRadius: 5,
  },
  registerButtonError: {
    padding: 10,
    backgroundColor: '#67b5fa',
    fontWeight: 'bold',
    marginVertical: 5,
    borderRadius: 5,
  },
  registerTextEnabled: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  registerTextError: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
});

export default Register;
