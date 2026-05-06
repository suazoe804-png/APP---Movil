import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import HomeScreen from './screens/HomeScreen';
import FormScreen from './screens/FormScreen';
import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import HelpScreen from './screens/HelpScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authenticateUser } from './services/firebase';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppContent() {
  useEffect(() => {
    // Authenticate anonymously so the user can interact with the DB rules safely
    authenticateUser();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
        id="RootStack"
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E40AF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Form" 
          component={FormScreen} 
          options={({ route }) => ({ 
            title: route.params?.id ? '✏️ Editar Solicitud' : '📄 Nueva Solicitud' 
          })} 
        />
        <Stack.Screen 
          name="List" 
          component={ListScreen} 
          options={{ title: '📋 Lista de Tickets' }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: '🔍 Detalle de Solicitud' }} 
        />
        <Stack.Screen 
          name="Help" 
          component={HelpScreen} 
          options={{ title: 'ℹ️ Ayuda y Contacto' }} 
        />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
