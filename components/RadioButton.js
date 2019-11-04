import React, { Component } from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';

export default class RadioButtons extends Component {
  state = {
    value: this.props.default,
  };

  handleOnPress = selectedKey => {
    this.setState({
      value: selectedKey,
    });

    this.props.onChangeButton(selectedKey);
  };

  render() {
    const { options, label } = this.props;
    const { value } = this.state;

    return (
      <View style={styles.mainContainer}>
        <Text style={styles.textLabelStyle}>{label}</Text>
        {options.map(item => {
          return (
            <View key={item.key}>
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => this.handleOnPress(item.key)}
              >
                <View style={styles.buttonContainer}>
                  <Text style={styles.textStyle}>{item.text}</Text>
                  <View style={styles.circle}>
                    {value === item.key && <View style={styles.checkedCircle} />}
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  mainContainer: {
    // marginHorizontal: 10,
    marginTop: 13,
  },
  textStyle: {
    fontSize: 16,
  },
  textLabelStyle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#86939e',
    marginBottom: 7,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#794F9B',
  },
});
