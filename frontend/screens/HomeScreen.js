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
    if (!videoUrl.trim()) {
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
            outlineColor="#007AFF"
            activeOutlineColor="#007AFF"
            editable={true}
            selectTextOnFocus={true}
          />

          <Text style={styles.label}>Select Output Language:</Text>

          <Button
            mode="outlined"
            onPress={() => setModalVisible(true)}
            style={styles.languageButton}
            labelStyle={styles.languageButtonLabel}
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
            disabled={loading || !videoUrl.trim()}
            style={styles.button}
            labelStyle={styles.buttonLabel}
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
    backgroundColor: '#FFFFFF',
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  card: {
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#F8F9FA',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#007AFF',
  },
  languageButton: {
    marginBottom: 20,
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  languageButtonLabel: {
    color: '#007AFF',
  },
  button: {
    marginVertical: 10,
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

export default HomeScreen;