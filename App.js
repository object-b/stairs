import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import AppNavigator from './navigation/AppNavigator';
import AppIntroSlider from 'react-native-app-intro-slider';
import { mapping, light as lightTheme } from '@eva-design/eva';
import {
  ApplicationProvider,
  Layout,
  Input,
  TopNavigation,
  Radio,
  Button,
  Text,
  RadioGroup,
} from 'react-native-ui-kitten';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isOnboardingDone, setOnboardingDone] = useState(false);
  const [isProfileCreated, setProfileCreated] = useState(false);
  const [userNameValue, onChangeUserName] = useState('');
  const [userGenderValue, onChangeUserGender] = useState(0);
  const [userAgeValue, onChangeUserAge] = useState(2);
  const [userCityValue, onChangeUserCity] = useState('Город');

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
      return (
        <ApplicationProvider mapping={mapping} theme={lightTheme}>
          <ScrollView>
            <Layout style={styles.profileContainer}>
              <TopNavigation
                title="Привет! Создадим профиль?"
                alignment="center"
                titleStyle={styles.profileTopNavigationTitle}
              />

              <Input
                label="Введи свой никнейм"
                style={styles.profileTextInput}
                value={userNameValue}
                onChangeText={text => onChangeUserName(text)}
                placeholder="runner_73"
              />

              <Input
                label="Введи свой город"
                value={userCityValue}
                onChangeText={text => onChangeUserCity(text)}
                placeholder="Ульяновск"
              />

              <Text appearance="hint" style={styles.profileTextLabel}>
                Выбери свой пол
              </Text>
              <RadioGroup
                style={styles.profileRadioGroup}
                selectedIndex={userGenderValue}
                onChange={onChangeUserGender}
              >
                <Radio style={styles.profileRadio} text="Мужчина" />
                <Radio style={styles.profileRadio} text="Женщина" />
                <Radio style={styles.profileRadio} text="У меня особый" />
              </RadioGroup>

              <Text appearance="hint" style={styles.profileTextLabel}>
                Выбери свой возраст
              </Text>
              <RadioGroup
                style={styles.profileRadioGroup}
                selectedIndex={userAgeValue}
                onChange={onChangeUserAge}
              >
                <Radio style={styles.profileRadio} text="До 14" />
                <Radio style={styles.profileRadio} text="14-18" />
                <Radio style={styles.profileRadio} text="18-30" />
                <Radio style={styles.profileRadio} text="30-45" />
                <Radio style={styles.profileRadio} text="45-60" />
                <Radio style={styles.profileRadio} text="60+" />
              </RadioGroup>

              <Button style={styles.profileButton} onPress={handlePressCreateProfile}>
                Завершить
              </Button>
            </Layout>
          </ScrollView>
        </ApplicationProvider>
      );
    }
  }

  function handlePressCreateProfile() {
    // setProfileCreated(true);

    console.log(
      'user name - ' +
        userNameValue +
        ' user gender - ' +
        userGenderValue +
        ' user age - ' +
        userAgeValue +
        ' user city - ' +
        userCityValue
    );
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
  tutorialTitle: {
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 16,
    color: 'rgba(255, 255, 255, .9)',
  },

  profileButton: {
    marginVertical: 15,
  },
  profileTopNavigationTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 25,
    backgroundColor: '#fff',
  },
  profileTextInput: {
    marginBottom: 7,
  },
  profileTextLabel: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  profileContainer: {
    marginTop: Constants.statusBarHeight + 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  profileRadio: {
    marginVertical: 4,
  },
});
