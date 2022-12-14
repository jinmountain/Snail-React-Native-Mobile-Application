import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
// business hours
import SetBusinessHoursScreen from '../screens/setBusinessHoursStack/SetBusinessHoursScreen';
import SetHoursScreen from '../screens/setBusinessHoursStack/SetHoursScreen';

const Stack = createStackNavigator();

const SetBusinessHoursStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="SetBusinessHours" 
        component={SetBusinessHoursScreen}
        initialParams={{ 
          userType: null,
          newHours: null,
          businessDay: null,
          // for tech 
          techId: null
        }}
      />
      <Stack.Screen 
        name="SetHours" 
        component={SetHoursScreen}
        initialParams={{ 
          businessDay: null,
          specialDateIndex: null,
          userType: null,
          techId: null,
        }}
        options={{ 
          cardStyle: {
            backgroundColor: 'transparent',
          },
          animationEnabled: true,
          presentation: 'transparentModal',
        }}
      />
    </Stack.Navigator>
  )
};

export default SetBusinessHoursStack;