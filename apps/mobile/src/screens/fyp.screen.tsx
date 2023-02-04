import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC } from "react";
import { Button, Text, View } from "react-native";

import { AuthStackParamList } from "../routes";

const FYPScreen: FC<NativeStackScreenProps<AuthStackParamList, "Fyp">> = ({
  navigation,
}) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Forgot your password Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default FYPScreen;
