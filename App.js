import React, { useEffect, useState, useContext, useRef } from 'react';
import 'react-native-gesture-handler';
import { LogBox, AppState } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
// import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';

// import { createBottomTabNavigator } from 'react-navigation-tabs';
// import * as ScreenOrientation from 'expo-screen-orientation';
// import { createStackNavigator } from 'react-navigation-stack';

// Sign in Sign up
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';

import PasswordResetScreen from './src/screens/PasswordResetScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import CameraScreen from './src/screens/CameraScreen';
import ImageUploadMethodModal from './src/screens/ImageUploadMethodModal';
import ImageZoominScreen from './src/screens/ImageZoominScreen';
import ChatScreen from './src/screens/ChatScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import ContentCreateScreen from './src/screens/ContentCreateScreen';
import SnailScreen from './src/screens/SnailScreen';

// navigation stacks
import ChatListStack from './src/navigations/ChatListStack';
import UserAccountStack from './src/navigations/UserAccountStack';
import PostsSwipeStack from './src/navigations/PostsSwipeStack';

// Navigations
import MainBottomTab from './src/navigations/MainBottomTab';
import BusinessBottomTab from './src/navigations/BusinessBottomTab';

// Context Providers
import { Provider as PostProvider } from './src/context/PostContext';
import { Provider as LocationProvider } from './src/context/LocationContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as SocialProvider } from './src/context/SocialContext';

// Contexts
import { Context as AuthContext } from './src/context/AuthContext';
import { Context as SocialContext } from './src/context/SocialContext';

// Navigate
import { navigationRef, isReadyRef } from './src/navigationRef';

// Hooks
import { wait } from './src/hooks/wait';
import useAppState from './src/hooks/useAppState';

// To assign console.log to nothing   
if (!__DEV__) {
  console.log = () => {};
}

const Stack = createStackNavigator();

const LoginFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Signin" 
        component={SigninScreen} 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PasswordReset" 
        component={PasswordResetScreen} 
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

const MainFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainBottomTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MainFlowPostsSwipeStack"
        component={PostsSwipeStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Snail" 
        component={SnailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen  
        name="UserAccountStack" 
        component={UserAccountStack}
        options={{ 
          headerShown: false,
        }}
      />
    {/* PostDetailScreen is here for Activity Tab's navigation to PostDetailScreen*/}
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ChatListStack" 
        component={ChatListStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ContentCreate" 
        component={ContentCreateScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ImageUploadMethodModal" 
        component={ImageUploadMethodModal}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="ImageZoomin" 
        component={ImageZoominScreen}
        options={{
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="BusinessMain" 
        component={BusinessBottomTab}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Firebase
import {
  localSigninFire
} from './src/firebase/authFire';
import {
  getUserNotificationsRealtime,
  getUserDataRealtime
} from './src/firebase/user/usersGetFire';
import {
  changeUserAppState
} from './src/firebase/user/usersPostFire';

// Hooks
import useNotifications from './src/hooks/useNotifications';
// import {useRoute} from '@react-navigation/native';

const App = () => {
  const [ splash, setSplash ] = useState(true);
  const [ schedulePushNotification ] = useNotifications();
  // const route = useRoute();
  // console.log(route.name);
  const { 
    state: { user, userId },
    addCurrentUserId,
    addCurrentUserData,
  } = useContext(AuthContext);

  const { 
    state: { appStateSocial },
    addAppStateSocial,
  } = useContext(SocialContext);

  // listen appState and post to users ref
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // change app state on user's data on firestore and context
  useEffect(() => {
    if (user && user.emailVerified) {
      changeUserAppState(user.id, appStateVisible);
      addAppStateSocial(user.id, appStateVisible);
    }
  }, [appStateVisible]);

  // receive the state of app and set state
  const handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  // start local sign in and app state listener
  useEffect(() => {
    // when user is not null and added from sign in or sign up skip local sign in
    if (!user) {
      const localSignin = localSigninFire();
      localSignin
      .then((userData) => {
        addCurrentUserId(userData.id);
        addCurrentUserData(userData);
        wait(1000).then(() => {
          // turn off splash / the default starting screen
          setSplash(false);
        });
      })
      .catch((error) => {
        console.log("Error occured: App: localSignin: ", error);
        wait(1000).then(() => {
          setSplash(false);
        });
      });
    }

    return () => {
      isReadyRef.current = false;
    }
  }, []);

  // user notification listener, user data listener
  useEffect(() => {
    let notificationListener;
    let userDataListener;
    let appStateListener;

    if (userId) {
      appStateListener = AppState.addEventListener('change', handleAppStateChange);
      notificationListener = getUserNotificationsRealtime(userId, schedulePushNotification);
      userDataListener = getUserDataRealtime(userId, addCurrentUserData);
    } else {
      if (notificationListener) {
        notificationListener();
      };
      if (userDataListener) {
        userDataListener();
      };

      if (appStateListener) {
        appStateListener.remove();
      }
    }

    return () => {
      // must unsubscribe when not in effect
      if (notificationListener) {
        console.log("App: unsubscribe: notificationListener");
        notificationListener();
      };
      if (userDataListener) {
        console.log("App: unsubscribe: userDataListener");
        userDataListener();
      };
      
      // remove app state listener
      if (appStateListener) {
        appStateListener.remove();
      }
    };
  }, [userId]);

  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
        console.log("READY");
      }}
    >
      {
        splash
        ? <ResolveAuthScreen />
        : user
        ? <MainFlow />
        : <LoginFlow />
        // USE WHEN USE REAL EMAILS
        // ? <ResolveAuthScreen />
        // : user && user.emailVerified === true
        // ? <MainFlow />
        // : user && user.emailVerified === false
        // ? <EmailVerificationScreen />
        // : <LoginFlow />
      }
    </NavigationContainer>
  );
};

export default () => {
  return (
    <PaperProvider>
      <SocialProvider>
        <PostProvider>
          <LocationProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </LocationProvider>
        </PostProvider>
      </SocialProvider>
    </PaperProvider>
  );
};