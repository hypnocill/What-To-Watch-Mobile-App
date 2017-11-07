import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import myStyles from '../../styles/AppStyles';

const ModalButton = ({ onPress, children }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300'
  },
  buttonStyle: {
    alignSelf: 'center',
    backgroundColor: myStyles.mainButton,
    borderRadius: 2,
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 4,
    marginTop: 65
  }
};

export default ModalButton;
