import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function SummaryCard({ item }) {
  const openVideo = () => {
    if (item.url) Linking.openURL(item.url);
  };

  return (
    <View style={styles.card}>
      {item.title && <Text style={styles.title}>{item.title}</Text>}
      {item.url && (
        <TouchableOpacity onPress={openVideo}>
          <Text style={styles.url}>{item.url}</Text>
        </TouchableOpacity>
      )}
      {item.summary && <Text style={styles.summary}>{item.summary}</Text>}
      {item.language && <Text style={styles.language}>Language: {item.language}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  url: { color: '#2e78b7', marginBottom: 6, textDecorationLine: 'underline' },
  summary: { fontSize: 14, marginBottom: 6 },
  language: { fontSize: 12, fontStyle: 'italic', color: '#555' },
});
