import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    // Temporary bypass - skip API calls
    console.log('Bypassing authentication for demo');
    
    try {
      // Store demo user data directly
      await AsyncStorage.setItem('username', 'DemoUser');
      await AsyncStorage.setItem('authToken', 'demo-token-123');
      
      Alert.alert('Success', 'Welcome to YouTube Summarizer!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              {isLogin ? 'Login' : 'Register'}
            </Title>
            
            {!isLogin && (
              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                mode="outlined"
                outlineColor="#007AFF"
                activeOutlineColor="#007AFF"
              />
            )}
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor="#007AFF"
              activeOutlineColor="#007AFF"
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              outlineColor="#007AFF"
              activeOutlineColor="#007AFF"
            />
            
            <Button
              mode="contained"
              onPress={handleAuth}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              {isLogin ? 'Login' : 'Register'}
            </Button>
            
            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
              style={styles.switchContainer}
            >
              <Text style={styles.switchText}>
                {isLogin
                  ? "Don't have an account? Register"
                  : 'Already have an account? Login'}
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 10,
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#F8F9FA',
  },
  button: {
    marginTop: 15,
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  switchText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;