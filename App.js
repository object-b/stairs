import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import AppNavigator from './navigation/AppNavigator';
import AppIntroSlider from 'react-native-app-intro-slider';
import RadioButton from './components/RadioButton';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isOnboardingDone, setOnboardingDone] = useState(false);
  const [isProfileCreated, setProfileCreated] = useState(false);
  const [userNameValue, onChangeUserName] = useState('');
  const [userGenderValue, onChangeUserGender] = useState('male');

  const slides = [
    {
      key: 'why',
      title: 'Зачем приложение',
      text: 'Да просто так.',
      image: require('./assets/images/icon.png'),
      backgroundColor: '#59b2ab',
      titleStyle: styles.title,
    },
    {
      key: 'ad',
      title: 'Реклама чемпионата',
      text: 'Два пенсионера пойдут бегать.\nПриложение вызовет скорую.',
      image: require('./assets/images/icon.png'),
      backgroundColor: '#febe29',
      titleStyle: styles.title,
    },
    {
      key: 'geo',
      title: 'Важность геолокации',
      text: 'Мы будем отслеживать тебя.\nТвой дом и твою собаку.',
      image: require('./assets/images/icon.png'),
      backgroundColor: '#22bcb5',
      titleStyle: styles.title,
    },
  ];

  const genders = [
    {
      key: 'male',
      text: 'Мужчина',
    },
    {
      key: 'female',
      text: 'Женщина',
    },
    {
      key: 'special',
      text: 'Особый',
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
      return (
        <ScrollView style={styles.profileContainer}>
          <View>
            <Text style={styles.profileTitle}>Познакомимся?</Text>
            <Text style={styles.profileSubtitle}>
              Расскажи о себе чуток больше, а там решим
            </Text>

            <TextInput
              style={styles.profileTextInput}
              onChangeText={text => onChangeUserName(text)}
              value={userNameValue}
              placeholder="Имя пользователя (никнейм)"
              underlineColorAndroid="#d3d3d3"
            />

            <RadioButton
              options={genders}
              default={userGenderValue}
              onChangeButton={value => onChangeUserGender(value)}
            />

            <Button onPress={handlePressCreateProfile} title="Создать профиль как бы" />
          </View>
        </ScrollView>
      );
    }
  }

  function handlePressCreateProfile() {
    // setProfileCreated(true);

    console.log(userNameValue, userGenderValue);
  }

  async function handleFinishOnboarding() {
    setOnboardingDone(true);

    try {
      await AsyncStorage.setItem('onboardingDone', 'true');
    } catch (error) {
      console.log(error.message, '- error in handleFinishOnboarding');
    }
  }

  function handleFinishLoading() {
    getOnboardingValue().then(status => {
      var isCompleted = status === 'true';

      console.log(isCompleted, '- check if user closed tutorial');

      setOnboardingDone(isCompleted);
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

async function getOnboardingValue() {
  try {
    const value = await AsyncStorage.getItem('onboardingDone');

    return value;
  } catch (error) {
    console.log(error.message, '- error in getOnboardingValue');
  }
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
  title: {
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 16,
  },

  profileTitle: {
    textAlign: 'center',
    fontWeight: '300',
    fontSize: 26,
    marginTop: 16,
    marginBottom: 13,
  },
  profileSubtitle: {
    textAlign: 'center',
    marginBottom: 13,
  },
  profileContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
  },
  profileTextInput: {
    height: 40,
    paddingLeft: 6,
    marginBottom: 15,
  },
});
