import firebase,  {firebaseRef, FBprovider} from '../firebase';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

function randomIntFromInterval(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

//Get Movie poster

export const getAPIdetails = () => {
  return (dispatch, getState) => {
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=key&query=' + getState().MovieInfo.movieInfo.title + '&year=' + getState().MovieInfo.movieInfo.year)
    .then((response) => {
      let posterURL = 'http://image.tmdb.org/t/p/w185' + response.data.results[0].poster_path;
      dispatch(storeAPIdetails(posterURL));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  }

export const storeAPIdetails = (posterURL, year) => {
  return {
    type: 'STORE_API_DETAILS',
    payload: {
      posterURL
    }
  }
}


//Add to Watched Movies Lists
export const addToWatchedMoviesStart = () => {
  return (dispatch, getState) => {
    dispatch(startAdding());
    let uid = getState().LoggedUser.user.uid;
    let movieInfo = getState().MovieInfo;
    let watchedMovie = {key: movieInfo.movieKey, title: movieInfo.movieInfo.title, year: movieInfo.movieInfo.year};

    firebaseRef.child('users/' + uid + '/' + movieInfo.movieKey).set(watchedMovie).then(() => {
      dispatch(finishAdding());

    }, () => console.log("can't add to watched movies") )
  }
}


export const startAdding = () => {
  return {
    type: 'START_ADDING_WATCHED_MOVIE'
  }
}

export const finishAdding = () => {
  return {
    type: 'FINISH_ADDING_WATCHED_MOVIE'
  }
}

export const resetWatchedMovie = () => {
  return {
    type: 'RESET_WATCHED_MOVIE'
  }
}

export const startStoreWatchedMovies = (watchedMovies) => {
  return (dispatch, getState) => {
    dispatch(storeWatchedMovies(watchedMovies));
  }
}

export const storeWatchedMovies = (watchedMovies) => {
  return {
    type: 'STORE_WATCHED_MOVIES',
    payload: watchedMovies
  }
}

//Lists Actions

export const startRemoveAllWatchedMovies = () => {
  return (dispatch, getState) => {
    dispatch(sending());
    let uid = getState().LoggedUser.user.uid;

    firebaseRef.child('users/' + uid + '/').set({}).then(() => {
      dispatch(sendingSuccess());
      dispatch(removeAllWatchedMovies());

    }, () => console.log("can't remove movies") )
  }
}

export const removeAllWatchedMovies = () => {
  return {
    type: 'REMOVE_ALL_WATCHED_MOVIES'
  }
}



export const startRemoveWatchedMovie = (key) => {
  return (dispatch, getState) => {
    dispatch(sending());
    let uid = getState().LoggedUser.user.uid;


    firebaseRef.child('users/' + uid + '/' + key).set({}).then(() => {
      dispatch(removeWatchedMovie());
      dispatch(sendingSuccess());

    }, () => console.log("can't add to watched movies") )
  }
}

export const removeWatchedMovie = () => {
  return {
    type: 'REMOVE_WATCHED_MOVIE',
  }
}


//Get Random Suggestions Actions

export const getRandomSuggestion = () => {
  return (dispatch, getState) => {
    let loggedUser = getState().LoggedUser;
    dispatch(resetWatchedMovie());
    dispatch(clearMovie());
    dispatch(sending());


    firebaseRef.child('moviesMeta/').once('value', (snapshot) => { // Main retreiving function - initiator
      let moviesObject = snapshot.val();
      let allMoviesArray = [];

        for(let prop in moviesObject){
          allMoviesArray = [...allMoviesArray, {key: prop, title: moviesObject[prop].title}];
        };

        let movieKey = allMoviesArray[randomIntFromInterval(0, allMoviesArray.length - 1)].key;

          if((loggedUser.user.id != '') && (loggedUser.WatchedMovies != null)){
            let watchedMoviesArray = Object.keys(loggedUser.WatchedMovies);
              if(watchedMoviesArray.indexOf(movieKey) != -1){
                do{
                  movieKey = allMoviesArray[randomIntFromInterval(0, allMoviesArray.length - 1)].key;
                } while((watchedMoviesArray.indexOf(movieKey) != -1) && (watchedMoviesArray.length < allMoviesArray.length));
              };

                if((watchedMoviesArray.length < allMoviesArray.length)){
                  dispatch(storeMovieKey(movieKey));
                }
          }

          if((loggedUser.user.id != '') && (loggedUser.WatchedMovies === null)){
            dispatch(storeMovieKey(movieKey));
          }

          if(loggedUser.user.id === ''){
            dispatch(storeMovieKey(movieKey));
          };



    }).then(() => {
      if(getState().MovieKey){
        dispatch(getMovieInfo(getState().MovieKey))
      } else {
          dispatch(sendingSuccess());
          Actions.ModalNothingToShow();
        }
    }, (e) => alert('Нещо се обърка'));
  }
}


export const getMovieInfo = (movieKey) => {   // Gives all the data and the Resume for the movie
  return (dispatch, getState) => {
    firebaseRef.child('movies/' + movieKey).once('value', (snapshot) => {
      dispatch(storeMovieInfo(movieKey, snapshot.val()));
    }).then(() => {
      dispatch(sendingSuccess());
      dispatch(getAPIdetails());
    }, (e) => alert('Нещо се обърка'));
  }
}

export const storeMovieInfo = (movieKey, movieInfo) => {
  return {
    type: 'STORE_MOVIE_INFO',
    payload: {
      movieKey,
      movieInfo
    }
  }
}

export const storeMovieKey = (movieKey) => { // Stores the Movie Key for use with Firebase
  return {
    type: 'STORE_MOVIE_KEY',
    payload: movieKey
  }
}

export const clearMovie = () => {
  return {
    type: 'CLEAR_MOVIE'
  }
}


//Suggest a Movie Form Actions

export const setTitle = (title) => {
  return {
    type: 'SET_TITLE',
    payload: title
  }
}

export const setYear = (year) => {
  return {
    type: 'SET_YEAR',
    payload: year
  }
}

export const setResume = (resume) => {
  return {
    type: 'SET_RESUME',
    payload: resume
  }
}


export const sendSuggestionForApproval = (title, year, resume, uid, id, displayName, email) => {
  return (dispatch, getState) => {
    let photoURL = "http://graph.facebook.com/v2.8/" + id + "/picture";

    let myDate = new Date();
    dispatch(sending());
    firebaseRef.child('userSubmissions/').push({
      title,
      year,
      resume,
      userCredentials: {
        uid,
        id,
        displayName,
        photoURL,
        email
      },
      date: myDate.getTime()
    }).then(() => {
        dispatch(setSent());
        dispatch(sendingSuccess());
      }, (e) => alert(e));
  }
}


export const setSent = () => {
  return {
    type: 'SET_SENT'
  }
}

export const clearUserSuggestion = () => {
  return {
    type: 'CLEAR_USER_SUGGESTION'
  }
}


export const startIsMovieAlreadySuggested = () => {
  return (dispatch, getState) => {
    dispatch(searchingForMovie());
    firebaseRef.child('moviesMeta/').once('value', (snapshot) => { // Main retreiving function - initiator
      let moviesObject = snapshot.val();
      let allMoviesArray = [];
      let titleFromUserSuggestion = getState().UserSuggestion.title.toLowerCase();

        for(let prop in moviesObject){
          allMoviesArray = [...allMoviesArray, moviesObject[prop].title.toLowerCase()];
        };

        let movieExistsInDB = allMoviesArray.indexOf(titleFromUserSuggestion);
          if(movieExistsInDB > 0){
            dispatch(movieAlreadySuggested(allMoviesArray[movieExistsInDB]));
          } else {
            dispatch(searchingForMovieFinished());
          }
    }); //omited THEN --------------------------------
  }
}

export const movieAlreadySuggested = (movie) => {
  return {
    type: 'MOVIE_ALREADY_SUGGESTED',
    payload: movie
  }
}

export const searchingForMovie = () => {
  return {
    type: 'SEARCHING_FOR_MOVIE_IN_DB',
  }
}

export const searchingForMovieFinished = () => {
  return {
    type: 'SEARCHING_FINISHED',
  }
}



//Loading

export const sending = () => {
  return {
    type: 'SENDING'
  }
}

export const sendingSuccess = () => {
  return {
    type: 'SENDING_SUCCESS'
  }
}


//Login / logout

export const login = (loggedUser) => {
  return {
    type: 'LOGIN',
    payload: loggedUser
  }
}

export const logout = () => {
  return {
    type: 'LOGOUT'
  }
}
