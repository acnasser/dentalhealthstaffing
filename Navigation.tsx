// Navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './userauthentication/login';
import CreateAccountPage from './userauthentication/create_account';
import { RootStackParamList } from './userauthentication/types'; // Import types
import MapPage from './userauthentication/MapPage';
import CreateProfile from './userauthentication/create_profile';


const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="CreateAccount" component={CreateAccountPage} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="MapPage" component={MapPage} />
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default Navigation;
