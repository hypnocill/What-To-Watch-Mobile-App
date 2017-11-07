import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity
} from 'react-native';

import ModalButton from './common/ModalButton';

import firebase, { FBprovider } from '../firebase';
import { LoginManager, LoginButton, AccessToken } from 'react-native-fbsdk';

import { connect } from 'react-redux';

import myStyles from '../styles/AppStyles';


import { Actions } from 'react-native-router-flux';


class ModalSuggest extends Component {
  renderLoginOrNot(){
    const auth = firebase.auth();
    const provider = firebase.auth.FacebookAuthProvider;
    let id = this.props.loggedUser.user.id;
      if(id === ''){
        return(
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Първо обаче трябва да се впишеш с Facebook</Text>
          <LoginButton
                  readPermissions={["public_profile"]}
                  onLoginFinished={ (error, result) => {
                      if (error) {
                        console.log('login has error: ', result.error)
                      } else if (result.isCancelled) {
                        console.log('login is cancelled.')
                      } else {
                          AccessToken.getCurrentAccessToken().then((data) => {
                            const { accessToken } = data;
                            const credential = provider.credential(accessToken);

                            console.log(data);
                            return auth.signInWithCredential(credential);


                        }).then(credData => {
                              Actions.pop();
                              console.log(credData);
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
              );
      } else {
          return(
            <ModalButton onPress={() => Actions.pop()}>Съгласен съм</ModalButton>
          );
      }
  }

  render(){
    const auth = firebase.auth();
    const provider = firebase.auth.FacebookAuthProvider;
    let id = this.props.loggedUser.user.id;
      return(
        <View style={styles.container}>
          <Text style={styles.welcome}>Ако много искаш да споделиш твой любим филм, можеш да го направиш точно тук.{"\n"}Просто попълни оригиналното му име на латиница, годината на филма и
          напиши своята препоръка на кирилица - грамотно, за да бъде четена с удоволствие от другите.{"\n"}{"\n"}
          След като изпратиш своята препоръка, тя ще бъде прегледана, и ако всичко с нея е наред, ще бъде одобрена и другите потребители на приложението ще могат да й се насладят.</Text>
        {this.renderLoginOrNot()}
        </View>
      );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: myStyles.background,
  },
  buttonStyle: {
    alignSelf: 'center',
    backgroundColor: myStyles.buttonBackground,
    borderRadius: 0,
    padding: 8,
    margin: 4,

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

export default connect((state) => {
    return {
      loggedUser: state.LoggedUser
    };
  })(ModalSuggest);
