import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ navigation, route }) {
  const userEmail = route.params?.userEmail || 'Guest';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.info}>Email: {userEmail}</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  info: { fontSize: 18, marginBottom: 20 },
  logoutBtn: { backgroundColor: '#e74c3c', padding: 14, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: '600' },
});
