import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import SummaryCard from '../components/SummaryCard';
import LanguageModal from '../components/LanguageModal';
import api from '../config/api';

export default function HomeScreen({ navigation, route }) {
  const [url, setUrl] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [language, setLanguage] = useState('English');

  const onSummarize = async () => {
    if (!url) return Alert.alert('Error', 'Enter YouTube URL');

    try {
      const resp = await fetch(`${api.baseUrl}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, target_language: language }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || 'Server error');
      }

      const data = await resp.json();
      setSummaries(prev => [{ id: Date.now().toString(), ...data, url }, ...prev]);
      setUrl('');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summarize a YouTube Video</Text>

      <TextInput
        placeholder="Paste YouTube URL"
        style={styles.input}
        value={url}
        onChangeText={setUrl}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setLangModalVisible(true)}
        >
          <Text>Language: {language}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onSummarize}>
          <Text style={{ color: '#fff' }}>Summarize</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={summaries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <SummaryCard item={item} />}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No summaries yet</Text>}
      />

      <LanguageModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
        onSelect={(lang) => {
          setLanguage(lang);
          setLangModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  langBtn: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2e78b7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
