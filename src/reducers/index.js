import { combineReducers } from 'redux';

import {
  sendingReducer,
  getRandomMovieKeyReducer,
  alreadySuggestedMoviesReducer,
  storeMovieInfoReducer,
  loginReducer,
  suggestMovieFormReducer,
  watchedMoviesReducer,
  welcomeMessageReducer,
  aboutUsMessageReducer
} from './Reducers';

export default combineReducers({
  Loading: sendingReducer,
  MovieKey: getRandomMovieKeyReducer,
  AlreadySuggestedMovieKeys: alreadySuggestedMoviesReducer,
  MovieInfo: storeMovieInfoReducer,
  LoggedUser: loginReducer,
  UserSuggestion: suggestMovieFormReducer,
  WatchedMovie: watchedMoviesReducer,
  WelcomeMessage: welcomeMessageReducer,
  AboutUsMessage: aboutUsMessageReducer
});
