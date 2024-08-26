import React, { useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const { login, user } = useContext(AuthContext);

  useEffect(() => {
    if(username !== '' && password != '') {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [username, password]);

  // useEffect(() => {
  //   console.log(user);
  //   AsyncStorage.getItem('@user_token').then((value) => { console.log(value); }); 
  // }, [user]);

  const handleLogin = async () => {
    login(username, password);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable onPress={() => router.navigate('/register')}>
        <Text style = {styles.registerText}>Don't have an account? Register here</Text>
      </Pressable>
      <View style = {isEnabled ? styles.loginButtonEnabled : styles.loginButtonError}>
        <Pressable 
          onPress={() => {handleLogin()}}
          disabled={!isEnabled}
          style = {(pressedData) => pressedData.pressed && styles.pressed}
        >
          <Text style = {isEnabled ? styles.loginTextEnabled : styles.loginTextError }>Log In</Text>
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
  loginText: {
    
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