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
import Svg, { G, Path } from "react-native-svg";
import { decamelize } from "humps";
import { createSignature } from "@/actions/actions";
import { Redirect } from 'expo-router';

export type Point = {
  x: number;
  y: number;
};

const round = (n: number): string => n.toFixed(0);

const pointsToSvg = (points: Point[]) => {
  if (points.length > 0) {
    return (
      `M ${round(points[0].x)},${round(points[0].y)}` +
      points.slice(1).map((point) => ` L ${round(point.x)},${round(point.y)}`)
    );
  } else {
    return "";
  }
};

export type Stroke = {
  attributes: Record<string, string | number>;
  type: string;
};


export const convertStrokesToSvg = (
  strokes: Stroke[],
  { width, height }: { width: number; height: number }
): string => {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" version="1.1">
      <g>
        ${strokes
          .map(
            (stroke) =>
              `<${stroke.type.toLowerCase()} ${Object.keys(stroke.attributes)
                .map(
                  (a) =>
                    `${decamelize(a, { separator: "-" })}="${
                      stroke.attributes[a]
                    }"`
                )
                .join(" ")}/>`
          )
          .join("\n")}
      </g>
    </svg>
  `;
};

//<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" version="1.1">
    

type SignatureProps = {
  strokeWidth?: number;
  color?: string;
};

const CreateSignatureScreen = ({
  strokeWidth = 4,
  color = "#000000",
}: SignatureProps) => {
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [strokes, setPreviousStrokes] = useState<Stroke[]>([])
  const [sigCreated, setSigCreated] = useState(false);
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

  const onResponderRelease = () => {
    if (currentPoints.length < 1) return;

    if (currentPoints.length === 1) {
      let p = currentPoints[0];
      let distance = Math.sqrt(strokeWidth) / 2;
      currentPoints.push({ x: p.x + distance, y: p.y + distance });
    }

    let newElement: Stroke = {
      type: "Path",
      attributes: {
        d: pointsToSvg(currentPoints),
        stroke: color,
        strokeWidth: strokeWidth,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    };

    setPreviousStrokes((oldPrevStrokes) => [...oldPrevStrokes, newElement]);
    setCurrentPoints([]);
  };

  const onTouch = (evt: GestureResponderEvent) => {
    setCurrentPoints([
      ...currentPoints,
      { x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY },
    ]);
  };

  const handleSubmit = async () =>{
    const formData = new FormData();
    const svgFromStrokes = convertStrokesToSvg(strokes, { width: sigWidth, height: sigHeight });
    console.log('screen width: ', sigWidth);
    console.log('screen height: ', sigHeight);
    //console.log('svgfrom strokes: ', svgFromStrokes);
    const base64Svg = btoa(svgFromStrokes);
    //console.log('base64 svg: ', base64Svg);
    
    const sigString = `data:image/svg+xml;base64,${base64Svg}`;
    formData.append('sigData', sigString);
    const res = await createSignature(formData);
    if(res.success === true){
      setSigCreated(true);
    }
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_) => true,
    onMoveShouldSetPanResponder: (_) => true,
    onPanResponderGrant: onTouch,
    onPanResponderMove: onTouch,
    onPanResponderRelease: () => onResponderRelease(),
  });

  if(sigCreated === true){
    return (<Redirect href="/" />);  
  }else{
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Create your signature</ThemedText>
          <View style={[styles.svgContainer, { maxHeight: sigHeight, width: sigWidth }]} {...panResponder.panHandlers}>
          <Svg style={styles.drawSurface}  preserveAspectRatio="xMidYMid meet"  >
            <G style={styles.GdrawSurface}>
              {strokes.map((stroke) => (
                <Path
                {...stroke.attributes}
                key={JSON.stringify(stroke.attributes)}
                />
              ))}
              <Path
                d={pointsToSvg(currentPoints)}
                stroke={color}
                strokeWidth={strokeWidth || 4}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </G>
          </Svg>
        </View>
          <Button title="Create Signature" onPress={handleSubmit}/>    
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

export default CreateSignatureScreen;