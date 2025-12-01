import { StyleSheet, FlatList, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getSignatures } from '@/actions/actions';
import React, { useState, useEffect } from "react";
import { SvgXml } from 'react-native-svg';

const SignaturesScreen = () => {
  const [signatures, setSignatures] = useState<any[]>([]);
  
  useEffect(() => {
    async function getSigs(){
      const sigs: any[] = await getSignatures();
      setSignatures(sigs);
      console.log('sigs: ', sigs);
    }
    getSigs();
  }, []);
  
  type ItemProps = {data: string, created: string, active: boolean};

  const Item = ({data, created, active}: ItemProps) => (
    <View style={styles.sigContainer}>
      <Text style={styles.sigTitle}>{'Active: '+active}</Text>
      <SvgXml xml={`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
              <image href="data:image/svg+xml;base64,${data}" width="640" height="480"/></svg>`} 
              width="640" height="480" />
      <Text style={styles.sigTitle}>{'Created: '+created}</Text>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>My Signatures</ThemedText>
        <FlatList
          data={signatures}
          renderItem={({item}) => <Item data={item.data} active={item.active} created={item.created}/>}
          keyExtractor={item => item.id}
        />
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
  sigTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sigContainer: {
    backgroundColor: 'gainsboro',
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default SignaturesScreen;