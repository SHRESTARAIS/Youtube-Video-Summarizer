import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Card, Title, ActivityIndicator } from 'react-native-paper';
import api from '../config/api';

const HomeScreen = ({ navigation }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('english');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const handleSummarize = async () => {
    if (!videoUrl.trim()) {
      Alert.alert('Error', 'Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const response = await api.post('/summarize', {
        video_url: videoUrl,
        language: language
      });

      if (response.data.success) {
        setSummary(response.data.summary);
        Alert.alert('Success', 'Summary generated successfully!');
      } else {
        Alert.alert('Error', response.data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Summary error:', error);
      Alert.alert('Error', 'Failed to generate summary. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    'english', 'hindi', 'spanish', 'french', 'german', 
    'chinese', 'japanese', 'arabic', 'russian', 'portuguese'
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>YouTube Video Summarizer</Title>
            <Text style={styles.subtitle}>
              Get AI-powered summaries of any YouTube video in your preferred language
            </Text>

            <TextInput
              label="YouTube Video URL"
              value={videoUrl}
              onChangeText={setVideoUrl}
              style={styles.input}
              mode="outlined"
              placeholder="https://www.youtube.com/watch?v=..."
              autoCapitalize="none"
            />

            <Button
              mode="outlined"
              onPress={() => setShowLanguages(true)}
              style={styles.languageButton}
            >
              Language: {language}
            </Button>

            <Button
              mode="contained"
              onPress={handleSummarize}
              loading={loading}
              disabled={loading || !videoUrl.trim()}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Generate Summary
            </Button>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>
                  Processing video... This may take a minute
                </Text>
              </View>
            )}

            {summary ? (
              <Card style={styles.summaryCard}>
                <Card.Content>
                  <Title style={styles.summaryTitle}>📝 AI Summary</Title>
                  <Text style={styles.summaryText}>{summary}</Text>
                </Card.Content>
              </Card>
            ) : null}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Language Modal */}
      {showLanguages && (
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <Card.Content>
              <Title>Select Language</Title>
              <ScrollView style={styles.languagesList}>
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    mode={language === lang ? "contained" : "outlined"}
                    onPress={() => {
                      setLanguage(lang);
                      setShowLanguages(false);
                    }}
                    style={styles.langButton}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Button>
                ))}
              </ScrollView>
              <Button
                mode="text"
                onPress={() => setShowLanguages(false)}
                style={styles.closeButton}
              >
                Close
              </Button>
            </Card.Content>
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  languageButton: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
  buttonLabel: {
    color: 'white',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#f8f9fa',
  },
  summaryTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  summaryText: {
    lineHeight: 20,
    fontSize: 14,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    maxHeight: '80%',
  },
  languagesList: {
    maxHeight: 300,
    marginVertical: 16,
  },
  langButton: {
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 8,
  },
});

export default HomeScreen;