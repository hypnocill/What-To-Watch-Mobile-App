import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity
} from 'react-native';

import ModalButton from './common/ModalButton';

import myStyles from '../styles/AppStyles';

import firebase, { FBprovider } from '../firebase';
import { LoginManager, LoginButton, AccessToken } from 'react-native-fbsdk';

import { Actions } from 'react-native-router-flux';


class Modal extends Component {

  render(){
    const auth = firebase.auth();
    const provider = firebase.auth.FacebookAuthProvider;

    return(
      <View style={styles.container}>
      <Text style={styles.welcome}>За да продължиш трябва да се впишеш чрез Facebook. Вписвайки се, ще можеш да отбелязваш кои филми си гледал, за да не ти бъдат препоръчвани отново.
      Също така, ти самият ще можеш да препоръчваш филми и да споделиш най-добрите си впечатления от тях с другите потребители!</Text>
      <LoginButton
              readPermissions={["public_profile", "email"]}
              onLoginFinished={ (error, result) => {
                  if (error) {
                    console.log('login has error: ', result.error)
                  } else if (result.isCancelled) {
                    console.log('login is cancelled.')
                  } else {
                      AccessToken.getCurrentAccessToken().then((data) => {
                        const { accessToken } = data;
                        const credential = provider.credential(accessToken);

                        return auth.signInWithCredential(credential);

                    }).then(credData => {
                          Actions.pop();
                      })
                      .catch(err => {
                          console.log(err);
                      });
                  }
                }
              }
              onLogoutFinished={() => {
                console.log("User logged out");
                auth.signOut();
                Actions.pop();
              }}/>
            <ModalButton onPress={() => Actions.pop()}>Скрий</ModalButton>
          </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: myStyles.background,
  },
  textStyle: {
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',

  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  }
});

export default Modal;
