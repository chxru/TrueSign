import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";

import { AppStackParamList } from "../routes";

const CameraScreen: FC<NativeStackScreenProps<AppStackParamList, "Camera">> = ({
  navigation,
}) => {
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const device = devices.back;

  if (device == null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Device returned null</Text>
      </View>
    );
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isFocused}
      photo={true}
    />
  );
};

export default CameraScreen;
