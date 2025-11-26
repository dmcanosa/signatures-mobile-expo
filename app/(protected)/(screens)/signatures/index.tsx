import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getSignatures } from '@/actions/actions';
import React, { useState, useEffect } from "react";
import NextCrypto from 'next-crypto';

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
  const [signatures, setSignatures] = useState<any[]>([]);

  const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY as string);
      
  useEffect(() => {
    const decryptedSignatures:any[] = [];
    
    const getSigs = async () => {
      console.log('getSigs!');
      const sigs: any[] = await getSignatures();
      //setSignatures(sigs);  
      //const decrypted = await crypto.decrypt(sigs[0].data);
      //console.log('decrypted 0: ',decrypted);

      await Promise.all(sigs.map( async (sig) => {
        console.log('decryp');
        /*const decrypted = await new Promise(resolve => {
          crypto.decrypt(sig.data)
        });*/

        const decrypted = await crypto.decrypt(sig.data);

        console.log('decrypted: ',decrypted);
        sig.data = decrypted;
        sig.key = sig.id;
        const date = new Date(sig.created);
        //console.log('date: ', date.toDateString());
        sig.created = date.toDateString();
        decryptedSignatures.push(sig);
        setSignatures([...signatures, sig]);
      }));
      //return decryptedSignatures;
    }
    //const decryptedSignatures:any[] = await getSigs();
    //console.log('sig ',getSigs());
    getSigs();
    //setSignatures(decryptedSignatures);
    //setSignatures(decryptedSignatures);  
    //console.error(error);
    console.log('sig ',signatures);
  }, []);
  
  /*useEffect(() => {
  (async function(){
    console.log('getSigs!');
    const sigs: any[] = await getSignatures();
    setSignatures(sigs);
  })();
  }, []);*/
    
  console.log('sig ',signatures);    

  const sigList = signatures.map((sig) => ( 
    <tr>
      <td key={sig.key}>{sig.key}</td>
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



//export default SignaturesScreen;