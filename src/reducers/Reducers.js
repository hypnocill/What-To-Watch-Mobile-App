export const getRandomMovieKeyReducer = (state = null, action) => {
  switch(action.type){
    case 'STORE_MOVIE_KEY':
      return action.payload;
    case 'CLEAR_MOVIE':
      return null;
    default:
      return state;
  };
};


export const sendingReducer = (state = false, action) => {
  switch(action.type){
    case 'SENDING':
      return true;
    case 'SENDING_SUCCESS':
      return false;
    default:
      return state;
  };
};

export const watchedMoviesReducer = (state = false, action) => {
  switch(action.type){
    case 'START_ADDING_WATCHED_MOVIE':
      return true;
    case 'FINISH_ADDING_WATCHED_MOVIE':
      return 'watched';
    case 'RESET_WATCHED_MOVIE':
      return false;
    default:
      return state;
  };
};


export const storeMovieInfoReducer = (state = null, action) => {
  switch(action.type){
    case 'STORE_MOVIE_INFO':
      return action.payload;
    case 'STORE_API_DETAILS':
      return {...state, ...action.payload};
    case 'CLEAR_MOVIE':
      return null;
    default:
      return state;
  };
};


const loginInitialState = {
  user: {
    displayName: '',
    email: '',
    id: '',
    photoURL: '',
    uid: ''
  },
  WatchedMovies: null

}

export const loginReducer = (state = loginInitialState, action) => {
  switch(action.type){
    case 'LOGIN':
      return {user: action.payload, WatchedMovies: null};
    case 'LOGOUT':
      return loginInitialState;
    case 'STORE_WATCHED_MOVIES':
      return {...state, WatchedMovies: action.payload}
    case 'REMOVE_WATCHED_MOVIE':
      return {...state}
    case 'REMOVE_ALL_WATCHED_MOVIES':
      return {...state}
    default:
      return state;
  };
};

//suggestMovieReducer

const suggestMovieInitialState = {
  title: '',
  year: '',
  resume: '',
  sent: false,
  movieAlreadySuggested: false
}

export const suggestMovieFormReducer = (state = suggestMovieInitialState, action) => {
  switch(action.type){
    case 'SET_TITLE':
      return {...state, title: action.payload};
    case 'SET_YEAR':
      return {...state, year: action.payload};
    case 'SET_RESUME':
      return {...state, resume: action.payload};
    case 'SET_SENT':
      return {...state, sent: true};
    case 'CLEAR_USER_SUGGESTION':
      return suggestMovieInitialState;
    case 'MOVIE_ALREADY_SUGGESTED':
      return {...state, movieAlreadySuggested: action.payload};
    case 'SEARCHING_FOR_MOVIE_IN_DB':
      return {...state, movieAlreadySuggested: 'searching'};
    case 'SEARCHING_FINISHED':
      return {...state, movieAlreadySuggested: false};
    default:
      return state;
  };
};
