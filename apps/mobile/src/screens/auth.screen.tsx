import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC } from "react";
import { Button, Text, View } from "react-native";

import { AuthStackParamList } from "../routes";

const AuthScreen: FC<NativeStackScreenProps<AuthStackParamList, "Auth">> = ({
  navigation,
}) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>TrueSign</Text>
      <Text>Login</Text>
      <Button
        title="Forgot your password?"
        onPress={() => navigation.navigate("Fyp")}
      />
    </View>
  );
};

export default AuthScreen;
