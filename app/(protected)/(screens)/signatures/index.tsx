import { StyleSheet, FlatList, View, Text, Dimensions, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getSignatures } from '@/actions/actions';
import React, { useState, useEffect } from "react";
import { SvgXml } from 'react-native-svg';

const SignaturesScreen = () => {
  const [signatures, setSignatures] = useState<any[]>([]);
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    async function getSigs(){
      const sigs: any[] = await getSignatures();
      setSignatures(sigs);
      console.log('sigs: ', sigs);
    }
    getSigs();
  }, []);
  
  type ItemProps = {data: string, created: string, active: boolean };

  const Item = ({data, created, active}: ItemProps) => (
    <View style={styles.sigContainer}>
      <Text style={styles.sigTitle}>{'Active: '+active}</Text>
      
      {data.indexOf('<svg') >= 0 ? 
        <SvgXml xml={data} style={styles.svgElement} preserveAspectRatio="xMidYMid meet" />
        :
        <Image
          source={{ uri: 'data:image/png;base64,'+data }}
          style={{ width: 200, height: 200 }} // Set appropriate styles
        />
      }
      

      <Text style={styles.sigTitle}>{'Created: '+created}</Text>
    </View>
  );

  //<SvgXml xml={data} style={styles.svgElement} preserveAspectRatio="xMidYMid meet" />
      

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>My Signatures</ThemedText>
        <FlatList
          contentContainerStyle={styles.flatlistContentStyles}
          style={[styles.flatlistStyles, { width: screenWidth }]}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    
  },
  flatlistStyles:{
    display: 'flex',
    width: '90%',
  },
  flatlistContentStyles:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  svgElement:{
    width: '100%', 
    height: '100%',
    aspectRatio: 4/3, 
  }
});

export default SignaturesScreen;