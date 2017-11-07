import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as mainActions from '../actions/mainActions';
import axios from 'axios';
import firebase,  {firebaseRef, FBprovider} from '../firebase';

import myStyles from '../styles/AppStyles';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  UIManager,
  LayoutAnimation,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { randomMessages } from './randomMessage';

import SingOut from './common/SingOut';
import Button from './BigButton';
import BigButton from './BigButton';
import Spinner from './common/Spinner';
import Card from './common/Card';
import CardSection from './common/CardSection';

class Main extends Component {
  constructor(props){
    super(props);
    //UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }


  renderScreen(){
    let { loading, movieInfo, loggedUser } = this.props;

    if(loading){
      return <Spinner size={100} color={myStyles.primaryColor}/>;
    } else if(movieInfo){
          return (
            <View>
              <Card>
                <CardSection style={{width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0 }}>
                  <Text style={{fontSize: 20, fontWeight: '500'}}>{movieInfo.movieInfo.title}</Text>
                  <Text style={{fontSize: 16, fontWeight: '300'}}>{movieInfo.movieInfo.year}</Text>
                    {movieInfo.posterURL ? <Image style={{width: 120, height: 180}} source={{uri: movieInfo.posterURL}} /> : <Spinner size={30} color={myStyles.primaryColor}/>}
                </CardSection>
                <CardSection style={{flexDirection: 'column'}}>
                  <Text style={{margin: 15}}>{movieInfo.movieInfo.resume}</Text>
                  {this.renderWatchedButton()}
                </CardSection>
                <CardSection style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  {movieInfo.movieInfo.userCredentials.photoURL ? <Image style={{width: 50, height: 50, borderRadius: 25}} source={{uri: movieInfo.movieInfo.userCredentials.photoURL}} /> : <Spinner size={20} color={myStyles.primaryColor}/>}
                  <Text style={{fontSize: 12}}>препоръчано от: {movieInfo.movieInfo.userCredentials.displayName}</Text>
                </CardSection>
              </Card>
              <View style={{flexDirection: 'column', marginTop: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../img/themoviedb.png')} style={{width: 35, height: 30}} />
                <Text style={{fontSize: 10}}>This product uses the TMDb API but is not endorsed or certified by TMDb. </Text>
              </View>
              <BigButton onPress={this.getSuggestion.bind(this)}>Препоръчай друг!</BigButton>
            </View>
          );
    } else {
        return (
          <View style={{alignSelf: 'stretch'}}>
            <BigButton
                height={100}
                onPress={this.getSuggestion.bind(this)}
                disabled={( (loggedUser.user.id != '') && (loggedUser.WatchedMovies === false) ) ? true : false}
                style={{alignSelf: 'stretch'}}>
                Препоръчай ми филм!
            </BigButton>
          </View>

        );
    }
  }

//da opravq da otvarq modal-a kogato ne e lognat user
  renderWatchedButton(){
    let { watchedMovie, loggedUser } = this.props;
      if(watchedMovie === false && loggedUser.user.id != ''){
        return <TouchableOpacity onPress={this.addToWatched.bind(this)} style={styles.buttonStyle}><Text style={styles.textStyle}>Не показвай повече/Добави към списък</Text></TouchableOpacity>;
      } else if(watchedMovie === 'watched'){
          return (
            <CardSection style={{width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0, borderTopWidth: 1 }}>
              <Text style={{color: myStyles.mainButton}}>
                Този филм няма да ти бъде препоръчван повече. Можеш да го намериш в твоя списък от менюто - <Icon name="list" size={15} color={myStyles.primaryColor} />
              </Text>
            </CardSection>
          );
        } else if(loggedUser.user.id === ''){
            return <TouchableOpacity onPress={() => Actions.modal()} style={styles.buttonStyle}><Text style={styles.textStyle}>Не показвай повече/Добави към списък</Text></TouchableOpacity>;
          } else {
            return <Spinner size={30} color={myStyles.primaryColor}/>;
          }

  }

  getSuggestion(){
    let { dispatch } = this.props;
      dispatch(mainActions.getRandomSuggestion());
  }

  addToWatched(){
    let { dispatch } = this.props;
      dispatch(mainActions.addToWatchedMoviesStart());
  }

  showSingOut(){
    let { loggedUser } = this.props;

    if(loggedUser.user.id != ''){
      return(
        <SingOut />
      );
    };
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.container}>
            { this.renderScreen() }
        </ScrollView>
        { this.showSingOut() }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    paddingTop: 108,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    alignItems: 'center'
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
    fontSize: 16,
    fontWeight: '300',
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonStyle: {
    alignSelf: 'center',
    backgroundColor: myStyles.buttonBackground,
    borderRadius: 2,
    paddingLeft: 6,
    paddingRight: 6,
    margin: 4,

  }
});

export default connect((state) => {
    return {
      loading: state.Loading,
      movieInfo: state.MovieInfo,
      watchedMovie: state.WatchedMovie,
      loggedUser: state.LoggedUser
    };
  })(Main);
