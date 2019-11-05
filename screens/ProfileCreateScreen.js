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
// import * as Device from 'expo-device';
import { AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

export default function ProfileCreateScreen(props) {
  const [userNameValid, setUserNameValid] = useState(true);
  const [userCityValid, setUserCityValid] = useState(true);

  const [userNameValue, onChangeUserName] = useState('');
  const [userCityValue, onChangeUserCity] = useState('Город');
  const [userGenderValue, onChangeUserGender] = useState(0);
  const [userAgeValue, onChangeUserAge] = useState(2);

  function handlePressCreateProfile() {
    setUserNameValid(true);
    setUserCityValid(true);

    if (userNameValue.length < 4) {
      setUserNameValid(false);
      return;
    }

    if (userCityValue.length < 3) {
      setUserCityValid(false);
      return;
    }

    const userData = {
      userName: userNameValue,
      userGender: userGenderValue,
      userAge: userAgeValue,
      userCity: userCityValue,
    };

    console.log(userData);
    props.setCreated(true);
    // AsyncStorage.setItem('isProfileCreated', 'true').then(() => {
    //   props.setCreated(true);

    //   AsyncStorage.setItem('userData', JSON.stringify(userData));
    // });
  }

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
            label="Введи никнейм"
            style={styles.profileTextInput}
            value={userNameValue}
            onChangeText={text => onChangeUserName(text)}
            placeholder="runner_73"
            status={userNameValid ? '' : 'danger'}
            caption={userNameValid ? '' : 'Некорректное значение'}
            textStyle={{ color: '#222' }}
          />

          <Input
            label="Введи город"
            value={userCityValue}
            onChangeText={text => onChangeUserCity(text)}
            placeholder="Ульяновск"
            status={userCityValid ? '' : 'danger'}
            caption={userCityValid ? '' : 'Некорректное значение'}
            textStyle={{ color: '#222' }}
          />

          <Text appearance="hint" style={styles.profileTextLabel}>
            Выбери пол
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
            Выбери возраст
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

const styles = StyleSheet.create({
  profileButton: {
    marginVertical: 15,
  },
  profileTopNavigationTitle: {
    fontSize: 18,
    // marginTop: 15,
    // marginBottom: 25,
    backgroundColor: '#fff',
  },
  profileTextInput: {
    marginTop: 7,
    marginBottom: 7,
  },
  profileTextLabel: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  profileContainer: {
    marginTop: Constants.statusBarHeight + 5,
    paddingHorizontal: 20,
    flex: 1,
  },
  profileRadio: {
    marginVertical: 4,
  },
});
