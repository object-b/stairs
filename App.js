import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AppIntroSlider from 'react-native-app-intro-slider';
import ProfileCreateScreen from './screens/ProfileCreateScreen';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isOnboardingDone, setOnboardingDone] = useState(false);
  const [isProfileCreated, setProfileCreated] = useState(false);

  const slides = [
    {
      key: 'why',
      title: 'Зачем приложение',
      text:
        'Commodo officia laboris sit aute est labore.\nPariatur veniam et ipsum incididunt commodo.',
      image: require('./assets/images/robot-dev.png'),
      backgroundColor: '#8fb2ab',
      titleStyle: styles.tutorialTitle,
    },
    {
      key: 'ad',
      title: 'Реклама чемпионата',
      text: 'Два пенсионера пойдут бегать.\nПриложение вызовет скорую.',
      image: require('./assets/images/robot-dev.png'),
      backgroundColor: '#deae29',
      titleStyle: styles.tutorialTitle,
    },
    {
      key: 'geo',
      title: 'Важность геолокации',
      text: 'Мы будем отслеживать тебя.\nТвой дом и твою собаку.',
      image: require('./assets/images/robot-dev.png'),
      backgroundColor: '#12bcb5',
      titleStyle: styles.tutorialTitle,
    },
  ];

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={handleFinishLoading}
      />
    );
  } else {
    // enter the app only if intro steps are completed
    if (isOnboardingDone && isProfileCreated) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }

    if (!isOnboardingDone) {
      return (
        <AppIntroSlider
          slides={slides}
          onDone={handleFinishOnboarding}
          renderDoneButton={renderDoneButton}
          renderNextButton={renderNextButton}
        />
      );
    }

    if (!isProfileCreated) {
      return <ProfileCreateScreen setCreated={setProfileCreated} />;
    }
  }

  function handleFinishOnboarding() {
    AsyncStorage.setItem('isOnboardingDone', 'true').then(() => {
      setOnboardingDone(true);
    });
  }

  function handleFinishLoading() {
    AsyncStorage.getItem('isOnboardingDone').then(value => {
      const isCompleted = value === 'true';
      console.log(isCompleted, '- check if user closed tutorial');
      setOnboardingDone(isCompleted);
    });

    AsyncStorage.getItem('isProfileCreated').then(value => {
      const isCreated = value === 'true';
      console.log(isCreated, '- check if user created profile');
      setProfileCreated(isCreated);
    });

    setLoadingComplete(true);
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
}

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
}

async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
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
  tutorialTitle: {
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 16,
    color: 'rgba(255, 255, 255, .9)',
  },
});
