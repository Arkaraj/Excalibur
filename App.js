import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Main from "./components/Main";
import AddScreen from "./components/Add";

const Stack = createStackNavigator();

import { firebaseConfig } from "./secret";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoaded(true);
        setLoggedIn(false);
      } else {
        setLoaded(true);
        setLoggedIn(true);
      }
    });
  }, []);

  if (loaded) {
    if (loggedIn) {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen
                name="Main"
                component={Main}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Add" component={AddScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  } else {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }
}
