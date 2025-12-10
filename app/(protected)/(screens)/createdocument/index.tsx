//import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from "react";
import {
  View,
  PanResponder,
  StyleSheet,
  GestureResponderEvent,
  Button,
  Dimensions
} from "react-native";
import { createDocument } from "@/actions/actions";
import { Redirect } from 'expo-router';

const CreateDocumentScreen = () => {
  //const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  //const [strokes, setPreviousStrokes] = useState<Stroke[]>([])
  const [docCreated, setDocCreated] = useState(false);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  var sigWidth = screenWidth;
  var sigHeight = screenHeight;

  if(screenWidth > screenHeight){
    sigHeight = (screenWidth * .4) * 0.75;
    sigWidth = (screenWidth * .4);
  }else{
    sigHeight = screenWidth * 0.75;
    sigWidth = screenWidth;
  }

  const handleSubmit = async () =>{
    const formData = new FormData();
    /*const svgFromStrokes = convertStrokesToSvg(strokes, { width: sigWidth, height: sigHeight });
    const base64Svg = btoa(svgFromStrokes);
    const sigString = `data:image/svg+xml;base64,${base64Svg}`;*/
    
    //formData.append('sigData', sigString);
    
    const res = await createDocument(formData);
    if(res.success === true){
      setDocCreated(true);
    }
  }

  if(docCreated === true){
    return (<Redirect href="/" />);  
  }else{
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Create your document</ThemedText>
          <View style={[styles.svgContainer, { maxHeight: sigHeight, width: sigWidth }]} >
          
        </View>
          <Button title="Create Document" onPress={handleSubmit}/>    
      </ThemedView>
    );
  }
};

let styles = StyleSheet.create({
  svgContainer: {
    flex: 1,
    backgroundColor: "#fff",
    aspectRatio: 4/3,
  },
  drawSurface: {
    flex: 1,
    height: '100%',
    aspectRatio: 4/3,
    width: '100%',
  },
  GdrawSurface: {
    
  },
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
});

export default CreateDocumentScreen;