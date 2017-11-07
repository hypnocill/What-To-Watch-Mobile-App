import { combineReducers } from 'redux';

import {
  sendingReducer,
  getRandomMovieKeyReducer,
  storeMovieInfoReducer,
  loginReducer,
  suggestMovieFormReducer,
  watchedMoviesReducer
} from './Reducers';

export default combineReducers({
  Loading: sendingReducer,
  MovieKey: getRandomMovieKeyReducer,
  MovieInfo: storeMovieInfoReducer,
  LoggedUser: loginReducer,
  UserSuggestion: suggestMovieFormReducer,
  WatchedMovie: watchedMoviesReducer
});
