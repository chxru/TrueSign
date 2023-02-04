import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import AuthScreen from "./screens/auth.screen";
import FYPScreen from "./screens/fyp.screen";

export type AuthStackParamList = {
  Auth: undefined;
  Fyp: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const Routes = () => {
  return (
    <NavigationContainer>
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Auth" component={AuthScreen} />
        <AuthStack.Screen name="Fyp" component={FYPScreen} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
