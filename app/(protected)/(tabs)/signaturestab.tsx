import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/config/supabase';
//import { useState, useEffect } from 'react';

export default function SignaturesTabScreen() {


  return (
    <ThemedView style={styles.container}>

      <View style={styles.linksContainer}>

        <ThemedText style={styles.linkText}>Welcome to the signatures page</ThemedText>
        

        <Link href="/createsignature" style={styles.link}>
          <ThemedText style={styles.linkText}>📋 Create a signature</ThemedText>
        </Link>

        <Link href="/signatures" style={styles.link}>
          <ThemedText style={styles.linkText}>❓ Signatures</ThemedText>
        </Link>

        {/* logout */}
        {/* <Link href="/logout" style={styles.link}> */}
        <TouchableOpacity style={styles.logoutLink} onPress={() => supabase.auth.signOut()}>
          <ThemedText style={styles.linkText}>🚪 Logout</ThemedText>
        </TouchableOpacity>
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