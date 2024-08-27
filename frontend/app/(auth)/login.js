import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);

  const [invalidCreds, setInvalidCreds] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try{
      const response = await login(data.username, data.password);
    }
    catch (error) {
      console.log(error);
      if(error.response.status === 400){
        setInvalidCreds(true);
      }
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Controller
        control={control}
        rules={{ required: 'Username is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
        name="username"
      />
      {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

      <Controller
        control={control}
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
        name="password"
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      {invalidCreds && <Text style={styles.errorText}>Sorry, your username and password don't match.</Text>}
      <Pressable 
        onPress={() => router.navigate('/register')}
        style={({ pressed }) => pressed && styles.pressed}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
      </Pressable>

      <View style={isValid ? styles.loginButtonEnabled : styles.loginButtonError}>
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={isValid ? styles.loginTextEnabled : styles.loginTextError}>Log In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  registerText: {
    color: '#0095f6',
    textAlign: 'center',
    marginVertical: 10,
  },
  loginButtonEnabled: {
    padding: 10,
    backgroundColor: '#0095f6',
    fontWeight: 'bold',
    marginVertical: 5,
    borderRadius: 5,
  },
  loginButtonError: {
    padding: 10,
    backgroundColor: '#67b5fa',
    fontWeight: 'bold',
    marginVertical: 5,
    borderRadius: 5,
  },
  loginTextEnabled: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  loginTextError: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
});
