import { combineReducers }		from 'redux';

import {
  sendingReducer,
  getRandomMovieKeyReducer,
  randomMovieFilterReducer,
  alreadySuggestedMoviesReducer,
  storeMovieInfoReducer,
  loginReducer,
  suggestMovieFormReducer,
  watchedMoviesReducer,
  welcomeMessageReducer,
  aboutUsMessageReducer,
  helperEmailReducer
}								from './Reducers';

export default combineReducers({
  Loading: sendingReducer,
  Filter: randomMovieFilterReducer,
  MovieKey: getRandomMovieKeyReducer,
  AlreadySuggestedMovieKeys: alreadySuggestedMoviesReducer,
  MovieInfo: storeMovieInfoReducer,
  LoggedUser: loginReducer,
  HelperEmail: helperEmailReducer,
  UserSuggestion: suggestMovieFormReducer,
  WatchedMovie: watchedMoviesReducer,
  WelcomeMessage: welcomeMessageReducer,
  AboutUsMessage: aboutUsMessageReducer
});
