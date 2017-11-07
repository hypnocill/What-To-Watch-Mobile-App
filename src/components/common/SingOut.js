import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import firebase,  {firebaseRef, FBprovider} from '../../firebase';
import { LoginManager, LoginButton, AccessToken } from 'react-native-fbsdk';


class SingOut extends Component {

  handleFacebookLogin () {
   LoginManager.logOut();
   firebase.auth().signOut();
 }

  render(){
    const auth = firebase.auth();
    return (
      <TouchableOpacity onPress={() => this.handleFacebookLogin()} style={{bottom: 0, alignSelf: 'center', marginBottom: 15, marginTop: 5}}>
        <Text>Отпиши се</Text>
      </TouchableOpacity>
    );
  }
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    marginLeft: 5,
    marginRight: 5
  }
};

export default SingOut;
