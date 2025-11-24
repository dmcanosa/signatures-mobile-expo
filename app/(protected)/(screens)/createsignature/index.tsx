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
} from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { decamelize } from "humps";
import { createSignature } from "@/actions/actions";
import { Redirect, useRouter } from 'expo-router';

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
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" version="1.1">
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
    const svgWidth:number = document.getElementById('svgSignature')?.clientWidth as number;
    const svgHeight:number = document.getElementById('svgSignature')?.clientHeight as number;
    console.log('svg width: ',svgWidth);
    //console.log('strokes ',strokes);
    const svgFromStrokes = convertStrokesToSvg(strokes, { width: svgWidth, height: svgHeight });
    //const encodedSvg = encodeURIComponent(svgFromStrokes);
    //console.log('svgfromstrokes: ',svgFromStrokes);
    //const base64Svg = btoa(encodedSvg);
    const base64Svg = btoa(svgFromStrokes);
    //console.log('sigDatabefore: ',base64Svg);
    //const base64Svg = Buffer.toString('base64');//  encodedSvg);
    const sigString = `data:image/svg+xml;base64,${base64Svg}`;
    formData.append('sigData', sigString);
    const res = await createSignature(formData);
    if(res.success === true){
      setSigCreated(true);
    }
    //if(await createSignature(formData) === true){
      //const router = useRouter();
      //router.navigate('/');

    //}
    //console.log('sigData: ',sigString);
    //return <Redirect href="/" />;
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
        
          
          <View style={styles.svgContainer} {...panResponder.panHandlers}>
          <Svg id='svgSignature' style={styles.drawSurface}>
            <G>
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
    maxHeight: "30%",
    width: "30%"
  },
  drawSurface: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CreateSignatureScreen;