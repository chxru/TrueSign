import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC } from "react";
import { Button, Text, View } from "react-native";

import { AuthStackParamList } from "../routes";
import { useAuthStore } from "../store/auth.store";

const AuthScreen: FC<NativeStackScreenProps<AuthStackParamList, "Auth">> = ({
  navigation,
}) => {
  const onAuth = useAuthStore((state) => state.onAuth);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>TrueSign</Text>
      <Text>Login</Text>
      <Button title="Login" onPress={() => onAuth()} />
      <Button
        title="Forgot your password?"
        onPress={() => navigation.navigate("Fyp")}
      />
    </View>
  );
};

export default AuthScreen;
