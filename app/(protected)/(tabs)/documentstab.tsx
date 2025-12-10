import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function DocumentsTabScreen() {

  return (
    <ThemedView style={styles.container}>

      <View style={styles.linksContainer}>

        <ThemedText style={styles.linkText}>Welcome to the documents page</ThemedText>
        
        <Link href="/createdocument" style={styles.link}>
          <ThemedText style={styles.linkText}>📋 Create a document</ThemedText>
        </Link>

        <Link href="/documents" style={styles.link}>
          <ThemedText style={styles.linkText}>❓ Documents</ThemedText>
        </Link>

      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  linksContainer: {
    width: '100%',
    gap: 15,
  },
  link: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
  logoutLink: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#b04435',
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
}); 