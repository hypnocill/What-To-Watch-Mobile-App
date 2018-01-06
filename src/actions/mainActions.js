import firebase, {firebaseRef, FBprovider} from	'../firebase';
import axios from								'axios';
import { Actions } from							'react-native-router-flux';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Helper Functions///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief	Get random number from range
 * 
 * @param	int min
 * @param	int max
 * 
 * @return	int
 */
function randNum( min, max )
{
	return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

/**
 * @brief	Get random movie key without in a smart way
 *
 * @details	Smart in this case means that we can't get the same result twice(movie key) before all
 * 			available results have been shown.
 * 			For instance - we have 10 movies. When we click 10 times on 'Препоръчай филм', we'll get the 10 different
 * 			movies consecutively withut showing any of them twice. On the 11th click, the cycle will repeat itself.
 * 
 * @param	array allMovies		- All available movies in the database
 * @param	array seenMovies	- All seen random suggestions in the app's current state
 * @param	function dispatch	- Redux's dispatch
 * 
 * @return	string
 */
function smartRandMovieKey( allMovies, seenMovies, dispatch )
{
	let moviesLen		= allMovies.length;
	let seenMoviesLen	= seenMovies.length;
	let indx			= randNum( 0, moviesLen - 1 );
	let currMovieKey	= allMovies[indx].key;

	if( seenMovies.indexOf( currMovieKey ) === -1 )
	{
		dispatch( storeAlreadySuggestedMovieKey( currMovieKey ) );

		return currMovieKey;
	}
	else
	{
		if( moviesLen === seenMoviesLen )
		{
			dispatch( clearAlreadySuggestedMovieKeys() );

			indx			= randNum( 0, moviesLen - 1 );
			currMovieKey	= allMovies[indx].key;

			return currMovieKey;
		}

		do
		{
			indx			= randNum( 0, moviesLen - 1 );
			currMovieKey	= allMovies[indx].key;
		}
		while( seenMovies.indexOf( currMovieKey ) !== -1 );

		dispatch( storeAlreadySuggestedMovieKey( currMovieKey ) );

		return currMovieKey;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////Ajax Sending Actions////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief	Terminal Redux action to the sendingReducer
 * 
 * @return	object
 */
export const sending		= () =>
{
	return {
		type: 'SENDING'
	};
};

/**
 * @brief	Terminal Redux action to the sendingReducer
 * 
 * @return	object
 */
export const sendingSuccess	= () =>
{
	return {
		type: 'SENDING_SUCCESS'
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Get Movie Poster///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief	Fetches details from the 'themoviedb' Api and calls storeAPIdetails with the posterUrl only
 * 
 * @return	function
 */
export const getAPIdetails		= () =>
{
	return ( dispatch, getState ) =>
	{
		axios.get( 'https://api.themoviedb.org/3/search/movie?api_key=134a204161434c9c926c81f562c80c06&query=' +
		 getState().MovieInfo.movieInfo.title + '&year=' + getState().MovieInfo.movieInfo.year )
		.then( ( response ) =>
		{
			let posterURL	= 'http://image.tmdb.org/t/p/w185' + response.data.results[0].poster_path;
			dispatch( storeAPIdetails( posterURL ) );
		}).catch( ( error ) =>
		{
			console.log( error );
		});
	};
};

/**
 * @brief	Terminal Redux action that provides the posterUrl to the storeMovieInfoReducer
 * 
 * @param	string posterUrl
 * @param	int year
 * 
 * @return	object
 */
export const storeAPIdetails	= ( posterURL, year ) =>
{
	return {
		type:	'STORE_API_DETAILS',
		payload: {
			posterURL
		}
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////Add To Watched Movies List/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief	Initializes adding a movie to watched movies action - uses startAdding and finishAdding terminal actions
 * 
 * @return	function
 */
export const addToWatchedMoviesStart	= () =>
{
	return ( dispatch, getState ) =>
	{
		dispatch( startAdding() );

		let uid				= getState().LoggedUser.user.uid;
		let movieInfo		= getState().MovieInfo;
		let watchedMovie	= {key: movieInfo.movieKey, title: movieInfo.movieInfo.title, year: movieInfo.movieInfo.year};

		firebaseRef.child( 'users/' + uid + '/' + movieInfo.movieKey).set(watchedMovie).then( () =>
		{
			dispatch( finishAdding() );
		}, () => console.log( "can't add to watched movies" ) );
	};
};

/**
 * @brief	Terminal Redux action to the watchedMoviesReducer
 * 
 * @return	object
 */
export const startAdding				= () =>
{
	return {
		type: 'START_ADDING_WATCHED_MOVIE'
	};
};

/**
 * @brief	Terminal Redux action to the watchedMoviesReducer
 * 
 * @return	object
 */
export const finishAdding				= () =>
{
	return {
		type: 'FINISH_ADDING_WATCHED_MOVIE'
	};
};

/**
 * @brief	Terminal Redux action to the watchedMoviesReducer
 * 
 * @return	object
 */
export const resetWatchedMovie			= () =>
{
	return {
		type: 'RESET_WATCHED_MOVIE'
	};
};

/**
 * @brief	Initializes the storing of all watched movies by the logged user
 * 
 * @param	object watchedMovies	- object from database's snapshot
 * 
 * @return	function
 */
export const startStoreWatchedMovies	= ( watchedMovies ) =>
{
	return ( dispatch ) =>
	{
		dispatch( storeWatchedMovies( watchedMovies ) );
	};
};

/**
 * @brief	Terminal Redux action to the loginReducer
 * 
 * @return	object
 */
export const storeWatchedMovies			= ( watchedMovies ) =>
{
	return {
		type: 'STORE_WATCHED_MOVIES',
		payload: watchedMovies
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////Lists Actions//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief	Initializes the removal of all watched movies, calls removeAllWatchedMovies terminal action
 * @return {[type]} [description]
 */
export const startRemoveAllWatchedMovies	= () =>
{
	return ( dispatch, getState ) =>
	{
		dispatch( sending() );

		let uid	= getState().LoggedUser.user.uid;

		firebaseRef.child( 'users/' + uid + '/' ).set( {} ).then( () =>
		{
			dispatch( sendingSuccess() );
			dispatch( removeAllWatchedMovies() );
		}, () => console.log("can't remove movies") );
	};
};

/**
 * @brief	Terminal Redux action to the loginReducer
 * 
 * @return	object
 */
export const removeAllWatchedMovies			= () =>
{
	return {
		type: 'REMOVE_ALL_WATCHED_MOVIES'
	};
};

/**
 * @brief	Initializes the removal of a single watched movie, calls removeWatchedMovie terminal action
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export const startRemoveWatchedMovie		= ( key ) =>
{
	return ( dispatch, getState ) =>
	{
		dispatch( sending() );

		let uid	= getState().LoggedUser.user.uid;

		firebaseRef.child( 'users/' + uid + '/' + key ).set( {} ).then( () =>
		{
			dispatch( removeWatchedMovie() );
			dispatch( sendingSuccess() );
		}, () => console.log("can't add to watched movies") );
	};
};

/**
 * @brief	Terminal Redux action to the loginReducer
 * 
 * @return	object
 */
export const removeWatchedMovie				= () =>
{
	return {
		type: 'REMOVE_WATCHED_MOVIE'
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////Get Random Suggestions Actions/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief	Gets a random movie suggestion
 * 
 * @return	function
 */
export const getRandomSuggestion			= () =>
{
	return ( dispatch, getState ) =>
	{
		let loggedUser	= getState().LoggedUser;

		dispatch( resetWatchedMovie() );
		dispatch( clearMovie() );
		dispatch( sending() );

		firebaseRef.child( 'moviesMeta/' ).once( 'value', ( snapshot ) =>
		{
			let moviesObject	= snapshot.val();
			let allMoviesArray	= [];

			for( let prop in moviesObject )
			{
				allMoviesArray	= [...allMoviesArray, {key: prop, title: moviesObject[prop].title}];
			}

			let movieKey	= smartRandMovieKey( allMoviesArray, getState().AlreadySuggestedMovieKeys, dispatch );

			if( ( loggedUser.user.id !== '' ) && ( loggedUser.WatchedMovies !== null ) )
			{
				let watchedMoviesArray	= Object.keys( loggedUser.WatchedMovies );

				if( watchedMoviesArray.indexOf( movieKey ) !== -1)
				{
					do
					{
						movieKey	= smartRandMovieKey( allMoviesArray, getState().AlreadySuggestedMovieKeys, dispatch );
					}
					while( ( watchedMoviesArray.indexOf( movieKey ) !== -1) && ( watchedMoviesArray.length < allMoviesArray.length ) );
				}

				if( ( watchedMoviesArray.length < allMoviesArray.length ) )
				{
					dispatch( storeMovieKey( movieKey ) );
				}
			}

			if( ( loggedUser.user.id !== '' ) && ( loggedUser.WatchedMovies === null ) )
			{
				dispatch( storeMovieKey( movieKey ) );
			}

			if( loggedUser.user.id === '' )
			{
				dispatch( storeMovieKey( movieKey ) );
			}

		}).then( () =>
		{
			if( getState().MovieKey )
			{
				dispatch( getMovieInfo( getState().MovieKey ) );
			}
			else
			{
				dispatch( sendingSuccess() );
				Actions.ModalNothingToShow();
			}
		}, ( e ) => console.log( 'Нещо се обърка' ) );
	};
};

export const getMovieInfo					= ( movieKey ) =>
{
	return ( dispatch ) =>
	{
		firebaseRef.child( 'movies/' + movieKey ).once( 'value', ( snapshot ) =>
		{
			dispatch( storeMovieInfo( movieKey, snapshot.val() ) );
		}).then( () =>
		{
			dispatch( sendingSuccess() );
			dispatch( getAPIdetails() );
		}, ( e ) => console.log( 'Нещо се обърка' ) );
	};
};

/**
 * @brief	Terminal Redux action to the storeMovieInfoReducer
 * 
 * @return	object
 */
export const storeMovieInfo					= ( movieKey, movieInfo ) =>
{
	return {
		type: 'STORE_MOVIE_INFO',
		payload: {
		  movieKey,
		  movieInfo
		}
	};
};

/**
 * @brief	Terminal Redux action to the getRandomMovieKeyReducer
 * 
 * @return	object
 */
export const storeMovieKey					= ( movieKey ) =>
{
	return {
		type: 'STORE_MOVIE_KEY',
		payload: movieKey
	};
};

/**
 * @brief	Terminal Redux action to the getRandomMovieKeyReducer and storeMovieInfoReducer 
 * 
 * @return	object
 */
export const clearMovie						= () =>
{
	return {
		type: 'CLEAR_MOVIE'
	};
};

/**
 * @brief	Terminal Redux action to the alreadySuggestedMoviesReducer
 * 
 * @return	object
 */
export const storeAlreadySuggestedMovieKey	= ( movieKey ) =>
{
	return {
		type: 'STORE_MOVIE_KEY_IN_ALREADY_SUGGESTED_MOVIES',
		payload: movieKey
	};
};

/**
 * @brief	Terminal Redux action to the alreadySuggestedMoviesReducer
 * 
 * @return	object
 */
export const clearAlreadySuggestedMovieKeys	= () =>
{
	return {
		type: 'CLEAR_ALREADY_SUGGESTED_MOVIES'
	};
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////Suggest A Movie Form Actions//////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief	Terminal Redux action to the suggestMovieFormReducer
 * 
 * @return	object
 */
export const setTitle						= ( title ) =>
{
	return {
		type: 'SET_TITLE',
		payload: title
	};
};

/**
 * @brief	Terminal Redux action to the suggestMovieFormReducer
 * 
 * @return	object
 */
export const setYear						= ( year ) =>
{
	return {
		type: 'SET_YEAR',
		payload: year
	};
};

/**
 * @brief	Terminal Redux action to the suggestMovieFormReducer
 * 
 * @return	object
 */
export const setResume						= ( resume ) =>
{
	return {
		type: 'SET_RESUME',
		payload: resume
	};
};

/**
 * @brief	Terminal Redux action to the suggestMovieFormReducer
 * 
 * @return	object
 */
export const setSent						= () =>
{
	return {
		type: 'SET_SENT'
	};
};

/**
 * @brief	Terminal Redux action to the suggestMovieFormReducer
 * 
 * @return	object
 */
export const clearUserSuggestion			= () =>
{
	return {
		type: 'CLEAR_USER_SUGGESTION'
	};
};

/**
 * @brief	Terminal Redux action to the suggestMovieFormReducer
 * 
 * @return	object
 */
export const sendSuggestionForApproval		= ( title, year, resume, uid, id, displayName, email ) =>
{
	return ( dispatch ) =>
	{
		let photoURL	= "http://graph.facebook.com/v2.8/" + id + "/picture";
		let myDate		= new Date();

		dispatch( sending() );

		firebaseRef.child( 'userSubmissions/' ).push({
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
		}).then( () =>
			{
				dispatch( setSent() );
				dispatch( sendingSuccess() );
		}, ( e ) => console.log( e ) );
	};
};

/**
 * @brief	Initializes the search in database to check if entered movie name already exists
 * 
 * @return	function
 */
export const startIsMovieAlreadySuggested	= () =>
{
	return ( dispatch, getState ) =>
	{
		dispatch( searchingForMovie() );

		firebaseRef.child( 'moviesMeta/' ).once( 'value', ( snapshot ) =>
		{
			let moviesObject			= snapshot.val();
			let allMoviesArray			= [];
			let titleFromUserSuggestion	= getState().UserSuggestion.title.toLowerCase();

			for( let prop in moviesObject )
			{
				allMoviesArray	= [...allMoviesArray, moviesObject[prop].title.toLowerCase()];
			}

			let movieExistsInDB	= allMoviesArray.indexOf( titleFromUserSuggestion );

			if( movieExistsInDB > 0 )
			{
				dispatch( movieAlreadySuggested( allMoviesArray[movieExistsInDB] ) );
			}
			else
			{
				dispatch( searchingForMovieFinished() );
			}
		}); //omited CATCH
	};
};

/**
 * @brief	Terminal Redux action to the suggestMovieFormReducer
 * 
 * @return	object
 */
export const movieAlreadySuggested			= ( movie ) =>
{
	return {
		type: 'MOVIE_ALREADY_SUGGESTED',
		payload: movie
	};
};

/**
 * @brief	Terminal Redux action to the suggestMovieFormReducer
 * 
 * @return	object
 */
export const searchingForMovie				= () =>
{
	return {
		type: 'SEARCHING_FOR_MOVIE_IN_DB',
	};
};

/**
 * @brief	Terminal Redux action to the suggestMovieFormReducer
 * 
 * @return	object
 */
export const searchingForMovieFinished		= () =>
{
	return {
		type: 'SEARCHING_FINISHED',
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////Login/Logout Actions////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief	Terminal Redux action to the loginReducer
 * 
 * @return	object
 */
export const login		= ( loggedUser ) =>
{
	return {
		type: 'LOGIN',
		payload: loggedUser
	};
};

/**
 * @brief	Terminal Redux action to the loginReducer
 * 
 * @return	object
 */
export const logout		= () =>
{
	return {
		type: 'LOGOUT'
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @brief	Terminal Redux action to the helperEmailReducer
 * 
 * @return	object
 */
export const setEmail	= ( email ) =>
{
	return {
		type: 'SET_USER_EMAIL',
		payload: email
	};
};

/**
 * @brief	Terminal Redux action to the helperEmailReducer
 * 
 * @return	object
 */
export const removeEmail	= () =>
{
	return {
		type: 'REMOVE_USER_EMAIL'
	};
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////Fetch Welcome Message///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const startFetchWelcomeMsg	= () =>
{
	return ( dispatch ) =>
	{
		firebaseRef.child( 'welcomeMessage/' ).once( 'value' ).then( ( snapshot ) =>
			{
				let welcomeObj	= snapshot.val();

				dispatch( fetchWelcomeMsg( welcomeObj ) );
			},
			() =>
			{
				let welcomeMsg	= {
					message: '', image: ''
				};
				dispatch( fetchWelcomeMsg( welcomeMsg ) );
			}
		);
	};
};

/**
 * @brief	Terminal Redux action to the welcomeMessageReducer
 *
 * @param	object welcomeObj
 * 
 * @return	object
 */
export const fetchWelcomeMsg		= ( welcomeObj ) =>
{
	return {
		type: 'WELCOME_MESSAGE',
		payload: welcomeObj
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////About Us Message/////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const startFetchAboutUsMsg	= () =>
{
	return ( dispatch ) =>
	{
		firebaseRef.child( 'aboutUsMessage/' ).once( 'value' ).then( ( snapshot ) =>
			{
				let aboutUsMessage	= snapshot.val();
				dispatch( fetchAboutUsMsg( aboutUsMessage ) );
			},
			() =>
			{
				dispatch( fetchAboutUsMsg( '' ) );
			}
		);
	};
};

/**
 * @brief	Terminal Redux action to the aboutUsMessageReducer
 * 
 * @return	object
 */
export const fetchAboutUsMsg		= ( aboutUsMessage ) =>
{
	return {
		type: 'ABOUT_US_MESSAGE',
		payload:	aboutUsMessage
	};
};