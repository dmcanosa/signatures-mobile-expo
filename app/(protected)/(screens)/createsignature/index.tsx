//import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from "react";
import {
  View,
  PanResponder,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { decamelize } from "humps";

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

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_) => true,
    onMoveShouldSetPanResponder: (_) => true,
    onPanResponderGrant: onTouch,
    onPanResponderMove: onTouch,
    onPanResponderRelease: () => onResponderRelease(),
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Create your signature</ThemedText>
      <View style={styles.svgContainer} {...panResponder.panHandlers}>
      <Svg style={styles.drawSurface}>
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
    </ThemedView>
  );
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