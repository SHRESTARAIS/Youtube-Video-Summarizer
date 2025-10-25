import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';

const SummaryCard = ({ summary, language, videoUrl, onSave, onShare, timestamp }) => {
  const handleCopy = () => {
    // Copy to clipboard functionality
    alert('Summary copied to clipboard!');
  };

  const handleShare = () => {
    // Share functionality
    if (onShare) {
      onShare(summary);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.languageTag}>
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </Text>
          <Text style={styles.timestamp}>
            {timestamp || 'Just now'}
          </Text>
        </View>
        
        <Text style={styles.summaryText}>{summary}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Text style={styles.actionText}>📋 Copy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionText}>📤 Share</Text>
          </TouchableOpacity>
          
          {onSave && (
            <TouchableOpacity style={styles.actionButton} onPress={onSave}>
              <Text style={styles.actionText}>💾 Save</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {videoUrl && (
          <Text style={styles.videoUrl} numberOfLines={1}>
            📹 {videoUrl}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  languageTag: {
    backgroundColor: '#6200ee',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  actionText: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500',
  },
  videoUrl: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default SummaryCard;