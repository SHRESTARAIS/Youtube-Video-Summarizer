import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import api from '../config/api';

export default function HistoryScreen({ route }) {
  const { userEmail } = route.params;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const resp = await fetch(`${api.baseUrl}/history?email=${encodeURIComponent(userEmail)}`);
      if (!resp.ok) throw new Error('Failed to fetch history');
      const data = await resp.json();
      setHistory(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your History</Text>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{ fontWeight: '700' }}>{item.title}</Text>
            <Text>{item.summary}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No history yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
});
