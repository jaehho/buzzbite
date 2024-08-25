import React, { useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Pressable } from 'react-native';
import { Redirect, Link, router } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, user } = useContext(AuthContext);

  useEffect(() => {
    console.log(user);
    AsyncStorage.getItem('@user_token').then((value) => { console.log(value); }); 
  }, [user]);
  const handleLogin = async() => {
    try 
    {const response = await
        fetch("http://localhost:8000/login/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password}),
        });
        const json = await response.json();
        console.log(json);
        console.log("positive login");
        // router.replace('/home');
    } 
    catch (error) { 
        console.log("error");
        // router.replace('/home');
    }
    
  };

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
      <Button title="Login" onPress={() => {
        login(username, password);
        router.navigate('/home')}}/>
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
  registerText: {
    textAlign: 'center',
  }
});
