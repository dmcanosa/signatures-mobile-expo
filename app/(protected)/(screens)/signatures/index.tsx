import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getSignatures } from '@/actions/actions';
import React, { useState, useEffect } from "react";
import { SvgXml } from 'react-native-svg';

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

export default function SignaturesScreen(){
  //const [signatures, setSignatures] = useState<any[]>([]);
  const [sigList, setSignaturesList] = useState<any[]>([]);

  useEffect(() => {
    async function getSigs(){
      const sigs: any[] = await getSignatures();
      //setSignatures(sigs);
      setSignaturesList(sigs.map((sig) => ( 
        <tr key={sig.key}>
          <td key={sig.key}>
            {sig.key}
            <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
              <image href="data:image/svg+xml;base64,${sig.data}" width="640" height="480"/></svg>`} 
              width="640" height="480" />
          </td>
        </tr>    
      )));
    }
    getSigs();
  }, []);
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>My Signatures</ThemedText>
      <ThemedText>Your signatures will appear here!</ThemedText>
        <table>
          <tbody>
            {sigList}
          </tbody>
        </table>
    </ThemedView>
  );
}