import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (username !== '' && password !== '' && email !== '') {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [username, password, email]);

  const handleRegister = async () => {
    const apiCall = async () => {
        try 
        {
            const response = await
            fetch("http://localhost:8000/register/", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, email: email, password: password}),
            });
            const json = await response.json();
            console.log(response.status);
            console.log(json);
            return json;
        } 
        catch (error) { 
            return error;
        }}

        const response = await apiCall();
        if(response.error) {
            console.warn(response.error);
            return;
        } else {

        }
  };

  return (
    <SafeAreaView style={styles.container}>
        <Pressable onPress={() => router.navigate('/login')}>
            <AntDesign name="left" size={24} color="black" />
        </Pressable>
        <View style={styles.inputContainter}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
        <View style = {isEnabled ? styles.registerButtonEnabled : styles.registerButtonError}>
        <Pressable 
            onPress={handleRegister}
            disabled={!isEnabled}
            style = {(pressedData) => pressedData.pressed && styles.pressed}
        >
            <Text style = {isEnabled ? styles.registerTextEnabled : styles.registerTextError }>Register</Text>
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
  inputContainter: {
    flex:1,
    justifyContent: 'center',
    padding: 20,
  },
  backArrow: {
    position: 'absolute',
    // top: '100',
    // left: '100',
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
  },
  registerTextError: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
    pressed: {
        opacity: 0.5,
    },
});

export default Register;
