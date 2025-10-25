import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Title, Card, ActivityIndicator, Button } from 'react-native-paper';
import api from '../config/api';
import SummaryCard from '../components/SummaryCard';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please login to view history');
        navigation.navigate('Login');
        return;
      }

      const response = await api.get('/history');
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            setHistory([]);
            Alert.alert('Success', 'History cleared');
          }
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Summary History</Title>
        {history.length > 0 && (
          <Button 
            mode="outlined" 
            onPress={handleClearHistory}
            style={styles.clearButton}
          >
            Clear All
          </Button>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {history.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>No History Yet</Text>
              <Text style={styles.emptyText}>
                Your summarized videos will appear here. Go to the Home screen to create your first summary!
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Home')}
                style={styles.createButton}
              >
                Create Summary
              </Button>
            </Card.Content>
          </Card>
        ) : (
          history.map((item) => (
            <SummaryCard
              key={item.id}
              summary={item.summary}
              language={item.language}
              videoUrl={item.video_url}
              timestamp={formatDate(item.created_at)}
              onSave={() => Alert.alert('Saved', 'Summary saved to favorites!')}
              onShare={(text) => Alert.alert('Share', `Share: ${text.substring(0, 50)}...`)}
            />
          ))
        )}
        
        {history.length > 0 && (
          <Text style={styles.historyCount}>
            {history.length} {history.length === 1 ? 'item' : 'items'} in history
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    borderColor: '#ff4444',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyCard: {
    marginTop: 50,
    alignItems: 'center',
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#6200ee',
  },
  historyCount: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#666',
    fontSize: 14,
  },
});

export default HistoryScreen;