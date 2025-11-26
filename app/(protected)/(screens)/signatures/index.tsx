import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getSignatures } from '@/actions/actions';
import React, { useState, useEffect } from "react";

const SignaturesScreen = () => {
  const [signatures, setSignatures] = useState<any[]>([]);

  useEffect(() => {
    (async function () {
      const sigs: any[] = await getSignatures();
      setSignatures(sigs);
      console.log('sigs: ',sigs);
    })();
    
    //console.error(error);
  }, []);

  const sigList = signatures.map((sig) => ( 
    <tr>
      <td>{sig.id}</td>
    </tr>    
  ));
    
  
  

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>My Signatures</ThemedText>
      <ThemedText>Your signatures will appear here!</ThemedText>
        <table>
          <tbody>
            {sigList}
          </tbody>
        </table>
      {
        
      }

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SignaturesScreen;