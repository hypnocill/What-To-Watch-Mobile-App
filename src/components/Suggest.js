import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Keyboard
} from 'react-native';

import SingOut from './common/SingOut';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import * as mainActions from '../actions/mainActions';

import Icon from 'react-native-vector-icons/FontAwesome';
import { LoginButton } from 'react-native-fbsdk';

import myStyles from '../styles/AppStyles';



class Suggest extends Component {
  constructor(props){
    super();
    this.state = {height: 0, behavior: 'position'};
  }

  componentWillUnmount(){
    let { dispatch } = this.props;
    dispatch(mainActions.clearUserSuggestion());
    this.setState({height: 0});
  }

  validation(){
    let { title, year, resume } = this.props.UserSuggestion;
      if( (title.length > 1) && (year.length == 4) && (year.match(/^[0-9]+$/) != null) && (resume.length > 7) ){
        return true;
      } else {
          return false;
      };
  }

  isMovieAlreadySuggested(){
    const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

    let { movieAlreadySuggested } = this.props.UserSuggestion;
    if(movieAlreadySuggested === 'searching'){
      return <Spinner size={30} color={myStyles.primaryColor}/>;
    } else if( (movieAlreadySuggested != 'searching') && (movieAlreadySuggested != false)  ){
        return (
          <Text style={{color: myStyles.mainButton, textAlign: 'center'}}>
           <B>{movieAlreadySuggested.charAt(0).toUpperCase() + movieAlreadySuggested.slice(1)}</B> е вече препоръчван. Шансът препоръката ти да бъде публикуванa ще е по-малък,
           което обаче не трябва да те спира да я изпратиш, ако смяташ, че си заслужава!
          </Text>
        );
      } else {
          return null;
      }
  }

  renderScreen(){
    let { dispatch, loggedUser, UserSuggestion, loading} = this.props;

    let { uid, id, displayName, email } = loggedUser.user;
    let { title, year, resume, sent } = UserSuggestion;

      if( (id === '') && (loading == false) ){
        return(
          <View>
            <Text style={styles.welcome}>За да препоръчваш филми, трябва първо да се впишеш чрез Facebook</Text>
            <TouchableOpacity onPress={() => Actions.modalSuggest()} style={styles.buttonStyle}><Text style={styles.textStyle}>Искам да продължа</Text></TouchableOpacity>
          </View>
        )
      } else if ( (id != '') && (loading == false) && (sent != true) ){
        //da dobavq onBlur proverqvane dali zaglavieto e veche preporachvano
        return(
          <Card>
            {this.isMovieAlreadySuggested()}
              <TextInput
                style={{width: "60%", alignSelf: 'center', borderColor: 'gray', borderWidth: 0, textAlign: 'center'}}
                placeholder="Име на филма (на латиница)"
                autoCorrect = {false}
                onChangeText={(text) => {
                  dispatch(mainActions.setTitle(text));
                }}
                onBlur={ () => dispatch(mainActions.startIsMovieAlreadySuggested()) }
              />

              <TextInput
                style={{width: "20%", alignSelf: 'center', borderColor: 'gray', borderWidth: 0, textAlign: 'center'}}
                placeholder="Година"
                autoCorrect = {false}
                onChangeText={(text) => {
                  dispatch(mainActions.setYear(text));
                }}
              />

              <TextInput
                style={{width: "90%", marginBottom: 10, marginTop: 10, alignSelf: 'center', borderColor: 'gray', borderWidth: 0, height: Math.max(35, this.state.height)}}
                placeholder="Цялата ти препоръка (на кирилица)"
                multiline={true}
                autoCorrect = {false}
                onChange={(event) => {
                  this.setState({height: event.nativeEvent.contentSize.height});
                }}
                onChangeText={(text) => {
                  dispatch(mainActions.setResume(text));
                }}
              />

            <TouchableOpacity
              onPress={ () => dispatch(mainActions.sendSuggestionForApproval(title, year, resume, uid, id, displayName, email)) }
              style={this.validation() ? styles.buttonStyle : styles.disabledButtonStyle }
              disabled={this.validation() ? false : true}

            >
                <Text style={styles.textStyle}>{this.validation() ? "Изпрати" : "Попълни полетата коректно и ще се активирам"}</Text>
            </TouchableOpacity>

          </Card>

        )
      } else if ( (sent == true) && (id != '') && (loading == false) ){
          return(
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
              <Text style={styles.welcome}>Препоръката ти беше изпратена успешно и е в процес на очакване на одобрение!</Text>
              <Icon name="check" size={60} color="#4CAF50" />
              <TouchableOpacity onPress={() => dispatch(mainActions.clearUserSuggestion())} style={styles.buttonStyle}>
                <Text style={styles.textStyle}>Препоръчай друг филм</Text>
              </TouchableOpacity>
            </View>
          );
      } else {
          return <Spinner size={100} color={myStyles.primaryColor}/>;
        }
  }

  render(){
    return (
      <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>{this.renderScreen()}</ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    marginRight: 0,
    marginLeft: 0,
    paddingTop: 108,
    paddingBottom: 5,
    backgroundColor: '#FFFFFF',

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#000000',
  },
  textStyle: {
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonStyle: {
    alignSelf: 'stretch',
    backgroundColor: myStyles.buttonBackground,
    borderRadius: 2,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
  },
  disabledButtonStyle: {
    alignSelf: 'stretch',
    backgroundColor: myStyles.disabledButtonBackground,
    borderRadius: 2,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
  }
});

export default connect((state) => {
    return {
      loading: state.Loading,
      loggedUser: state.LoggedUser,
      UserSuggestion: state.UserSuggestion
    };
  })(Suggest);
