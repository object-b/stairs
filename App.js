import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AppIntroSlider from 'react-native-app-intro-slider';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isShowRealApp, setShowRealApp] = useState(false);
  const slides = [
    {
      key: 'somethun',
      title: 'Зачем приложение',
      text: 'Да просто так.',
      image: require('./assets/images/icon.png'),
      backgroundColor: '#59b2ab',
      titleStyle: styles.title,
    },
    {
      key: 'somethun-dos',
      title: 'Реклама чемпионата',
      text: 'Два пенсионера пойдут бегать.\nПриложение вызовет скорую.',
      image: require('./assets/images/icon.png'),
      backgroundColor: '#febe29',
      titleStyle: styles.title,
    },
    {
      key: 'somethun1',
      title: 'Важность геолокации',
      text: 'Мы будем отслеживать тебя.\nТвой дом и твою собаку.',
      image: require('./assets/images/icon.png'),
      backgroundColor: '#22bcb5',
      titleStyle: styles.title,
    }
  ];

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete, setShowRealApp)}
      />
    );
  } else {
    if (isShowRealApp) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }

    return (
      <AppIntroSlider
        slides={slides}
        onDone={() => setOnboardingDone(setShowRealApp)}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
      />
    );
  }
}

function renderNextButton() {
  return (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="md-arrow-round-forward"
        color="rgba(255, 255, 255, .9)"
        size={24}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
};

function renderDoneButton() {
  return (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="md-checkmark"
        color="rgba(255, 255, 255, .9)"
        size={24}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );
};

async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
    }),
  ]);
}

async function getOnboardingStatus() {
  try {
    const value = await AsyncStorage.getItem('onboardingDone');

    return value;
  } catch (error) {
    console.log(error.message, '- error in setOnboardingStatus');
  }
}

async function setOnboardingDone(setShowRealApp) {
  setShowRealApp(true);

  try {
    await AsyncStorage.setItem('onboardingDone', 'true');
  } catch (error) {
    console.log(error.message, '- error in setOnboardingDone');
  }
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete, setShowRealApp) {
  getOnboardingStatus().then((status) => {
    var isTrueSet = (status === 'true');
    console.log(isTrueSet, '- check if user closed onboard');
    setShowRealApp(isTrueSet);
  });

  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 16,
  },
});
