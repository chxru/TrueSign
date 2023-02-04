import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC } from "react";
import { Text, View } from "react-native";

import { AppStackParamList } from "../routes";

const CameraScreen: FC<NativeStackScreenProps<AppStackParamList, "Camera">> = ({
  navigation,
}) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>This is Camera Screen</Text>
    </View>
  );
};

export default CameraScreen;
