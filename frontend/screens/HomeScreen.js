import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { TextInput, Button, Card, Title, ActivityIndicator } from 'react-native-paper';
import api from '../config/api';
import LanguageModal from '../components/LanguageModal';
import SummaryCard from '../components/SummaryCard';

const HomeScreen = ({ navigation }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('english');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const response = await api.get('/languages');
      setLanguages(response.data.languages);
    } catch (error) {
      console.error('Error loading languages:', error);
    }
  };

  const handleSummarize = async () => {
    if (!videoUrl) {
      Alert.alert('Error', 'Please enter a YouTube URL');
      return;
    }

    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      Alert.alert('Error', 'Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/summarize', {
        video_url: videoUrl,
        language: language,
      });

      if (response.data.success) {
        setSummary(response.data.summary);
        Alert.alert('Success', 'Summary generated successfully!');
      } else {
        Alert.alert('Error', response.data.error || 'Failed to generate summary');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Failed to connect to server'
      );
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLanguages();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Title style={styles.title}>YouTube Video Summarizer</Title>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="YouTube Video URL"
            value={videoUrl}
            onChangeText={setVideoUrl}
            style={styles.input}
            mode="outlined"
            placeholder="Paste YouTube URL here"
          />

          <Text style={styles.label}>Select Output Language:</Text>

          <Button
            mode="outlined"
            onPress={() => setModalVisible(true)}
            style={styles.languageButton}
          >
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </Button>

          <LanguageModal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            languages={languages}
            selectedLanguage={language}
            onSelectLanguage={setLanguage}
          />

          <Button
            mode="contained"
            onPress={handleSummarize}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="video"
          >
            {loading ? 'Processing...' : 'Generate Summary'}
          </Button>
        </Card.Content>
      </Card>

      {summary ? (
        <SummaryCard
          summary={summary}
          language={language}
          onSave={() => Alert.alert('Success', 'Summary saved to history!')}
        />
      ) : (
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>How to use:</Title>
            <Text style={styles.infoText}>
              1. Paste any YouTube video URL{'\n'}
              2. Select your preferred language{'\n'}
              3. Click "Generate Summary"{'\n'}
              4. Get your AI-powered summary!
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#333',
  },
  languageButton: {
    marginBottom: 20,
    borderColor: '#6200ee',
  },
  button: {
    marginVertical: 10,
    padding: 5,
    backgroundColor: '#6200ee',
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: '#e3f2fd',
  },
  infoTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1565c0',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

export default HomeScreen;