import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Title, Card, Button, Avatar, Divider } from 'react-native-paper';

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalSummaries: 0,
    languagesUsed: 0,
    joinedDate: '2024-01-01',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Mock user data - in real app, fetch from API
    const username = localStorage.getItem('username') || 'User';
    const email = localStorage.getItem('email') || 'user@example.com';
    
    setUserInfo({
      username,
      email,
    });
    
    // Mock stats - in real app, fetch from backend
    setStats({
      totalSummaries: 12,
      languagesUsed: 5,
      joinedDate: '2024-01-15',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            
            // Navigate to login
            navigation.navigate('Login');
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            navigation.navigate('Login');
          }
        },
      ]
    );
  };

  if (!userInfo) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={userInfo.username.substring(0, 2).toUpperCase()} 
          style={styles.avatar}
          color="white"
        />
        <Title style={styles.username}>{userInfo.username}</Title>
        <Text style={styles.email}>{userInfo.email}</Text>
      </View>

      {/* Statistics Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Your Statistics</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalSummaries}</Text>
              <Text style={styles.statLabel}>Total Summaries</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.languagesUsed}</Text>
              <Text style={styles.statLabel}>Languages Used</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Date(stats.joinedDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Settings Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>⚙️ Settings</Title>
          <Divider style={styles.divider} />
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🔔 Notifications</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🌐 Language Preferences</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>💾 Data Management</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>🛡️ Privacy & Security</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Actions Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>🔧 Actions</Title>
          <Divider style={styles.divider} />
          
          <Button 
            mode="outlined" 
            onPress={handleLogout}
            style={styles.actionButton}
            icon="logout"
          >
            Logout
          </Button>
          
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Home')}
            style={[styles.actionButton, styles.primaryButton]}
            icon="video"
          >
            Create New Summary
          </Button>
          
          <TouchableOpacity 
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>🗑️ Delete Account</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>YouTube Summarizer v2.0.0</Text>
        <Text style={styles.appCopyright}>© 2024 All rights reserved</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    elevation: 2,
  },
  avatar: {
    backgroundColor: '#6200ee',
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    margin: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  divider: {
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingArrow: {
    fontSize: 18,
    color: '#999',
  },
  actionButton: {
    marginVertical: 5,
  },
  primaryButton: {
    backgroundColor: '#6200ee',
  },
  deleteButton: {
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  deleteText: {
    color: '#ff4444',
    fontSize: 16,
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 12,
    color: '#999',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;