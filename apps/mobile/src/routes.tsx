import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuthStore } from "./store/auth.store";

// screens
import AuthScreen from "./screens/auth.screen";
import CameraScreen from "./screens/camera.screen";
import FYPScreen from "./screens/fyp.screen";

export type AppStackParamList = {
  Camera: undefined;
};

export type AuthStackParamList = {
  Auth: undefined;
  Fyp: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const Routes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
          <AppStack.Screen name="Camera" component={CameraScreen} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Auth" component={AuthScreen} />
          <AuthStack.Screen name="Fyp" component={FYPScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Routes;
