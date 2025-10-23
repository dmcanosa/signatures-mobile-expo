import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/config/supabase';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    getUserData();
  }, [userId]);  
  
  async function getUserData(){
    const user = await supabase.auth.getUser();
    console.log('user: ', user);
    setUserId(user.data.user?.email as string);
  }

  return (
    <ThemedView style={styles.container}>

      <View style={styles.linksContainer}>

        <ThemedText style={styles.linkText}>{userId}</ThemedText>
        

        <Link href="/my-listings" style={styles.link}>
          <ThemedText style={styles.linkText}>📋 My Listings</ThemedText>
        </Link>

        <Link href="/messages" style={styles.link}>
          <ThemedText style={styles.linkText}>💬 Messages</ThemedText>
        </Link>

        <Link href="/help" style={styles.link}>
          <ThemedText style={styles.linkText}>❓ Help Center</ThemedText>
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

//const user = await supabase.auth.getUser();
//console.log('user: ', user);


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