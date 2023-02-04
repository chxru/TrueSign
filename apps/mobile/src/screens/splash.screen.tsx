import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC, useEffect, useState } from "react";
import { Text, View } from "react-native";

import { AuthStackParamList } from "../routes";
import { CheckCameraPermission } from "../services/camera.service";

const SplashScreen: FC<
  NativeStackScreenProps<AuthStackParamList, "Splash">
> = ({ navigation }) => {
  const [showPermissionError, setShowPermissionError] = useState(false);

  useEffect(() => {
    (async () => {
      const permission = await CheckCameraPermission();

      if (permission) {
        navigation.navigate("Auth");
      } else {
        setShowPermissionError(true);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>TrueSign</Text>
      {showPermissionError && <Text>Camera access is disabled</Text>}
    </View>
  );
};

export default SplashScreen;
