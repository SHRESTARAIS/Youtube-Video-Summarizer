import React from 'react';
import { Modal, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

const LanguageModal = ({ visible, onDismiss, languages, selectedLanguage, onSelectLanguage }) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Title style={styles.modalTitle}>Select Language</Title>
          <ScrollView style={styles.modalScrollView}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageItem,
                  selectedLanguage === lang && styles.selectedLanguage,
                ]}
                onPress={() => {
                  onSelectLanguage(lang);
                  onDismiss();
                }}
              >
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === lang && styles.selectedLanguageText,
                  ]}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  languageItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguage: {
    backgroundColor: '#6200ee',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#6200ee',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LanguageModal;