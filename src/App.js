import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
//import createLogger from 'redux-logger';
import firebase, {firebaseRef} from './firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Router';

import * as mainActions from './actions/mainActions';

//const logger = createLogger();

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class App extends Component {
  render() {
    firebase.auth().onAuthStateChanged((user) => {

      let { dispatch } = this.props;
      if (user) {
        let {uid, displayName, photoURL} = user;
        let { email } = user.providerData[0];

        let id = user.providerData[0].uid;
          store.dispatch(mainActions.login({uid, id, displayName, email, photoURL}));

          if(id != ''){
            store.dispatch(mainActions.sending());
            firebaseRef.child('users/' + uid).on('value', (snapshot) => {

              if(snapshot != null){
                let watchedMovies = snapshot.val();

                store.dispatch(mainActions.startStoreWatchedMovies(watchedMovies));
                store.dispatch(mainActions.sendingSuccess());
              } else {
                  store.dispatch(mainActions.sendingSuccess());
              }
            });
          }
        } else {
            store.dispatch(mainActions.logout());
      }
    });
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;
