/**
 * @brief	Reducer managing state for random movie key
 * 
 * @param	null|object state
 * @param	string action
 * 
 * @return	null|object
 */
export const getRandomMovieKeyReducer		= ( state = null, action ) =>
{
	switch( action.type )
	{
		case 'STORE_MOVIE_KEY':
			return action.payload;
		case 'CLEAR_MOVIE':
			return null;
		default:
			return state;
	}
};

/**
 * @brief	Reducer managing state for the already suggested movies
 * 
 * @param	array state
 * @param	string action
 * 
 * @return	array
 */
export const alreadySuggestedMoviesReducer	= ( state = [], action ) =>
{
	switch( action.type )
	{
		case 'STORE_MOVIE_KEY_IN_ALREADY_SUGGESTED_MOVIES':
			return [...state, action.payload];
		case 'CLEAR_ALREADY_SUGGESTED_MOVIES':
			return [];
		default:
			return state;
	}
};

/**
 * @brief	Reducer managing state for the sending and sending success (loading)
 * 
 * @param	boolean state
 * @param	string action
 * 
 * @return	array
 */
export const sendingReducer				= ( state = false, action ) =>
{
	switch( action.type )
	{
		case 'SENDING':
			return true;
		case 'SENDING_SUCCESS':
			return false;
		default:
			return state;
	}
};

/**
 * @brief	Reducer managing state for the button 'не показвай повече'
 * 
 * @param	string|boolean state
 * @param	string action
 * 
 * @return	array
 */
export const watchedMoviesReducer		= ( state = false, action ) =>
{
	switch( action.type )
	{
		case 'START_ADDING_WATCHED_MOVIE':
			return true;
		case 'FINISH_ADDING_WATCHED_MOVIE':
			return 'watched';
		case 'RESET_WATCHED_MOVIE':
			return false;
		default:
			return state;
	}
};

/**
 * @brief	Reducer managing state for storing the suggested movie info
 * 
 * @param	null|object state
 * @param	string action
 * 
 * @return	null|object
 */
export const storeMovieInfoReducer		= ( state = null, action ) =>
{
	switch( action.type )
	{
		case 'STORE_MOVIE_INFO':
			return action.payload;
		case 'STORE_API_DETAILS':
			return {...state, ...action.payload};
		case 'CLEAR_MOVIE':
			return null;
		default:
			return state;
	}
};

/**
 * @const	helper const for the loginReducer
 */
const loginInitialState =
{
	user: {
		displayName: '',
		email: '',
		id: '',
		photoURL: '',
		uid: ''
	},
	WatchedMovies: null
};

/**
 * @brief	Reducer managing state for the login
 * 
 * @param	object state
 * @param	string action
 * 
 * @return	object
 */
export const loginReducer = ( state = loginInitialState, action ) =>
{
	switch( action.type )
	{
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
	}
};


/**
 * @const	helper const for suggestMovieFormReducer
 */
const suggestMovieInitialState =
{
	title: '',
	year: '',
	resume: '',
	sent: false,
	movieAlreadySuggested: false
};

/**
 * @brief	Reducer managing state for the suggest a movie form
 * 
 * @param	object state
 * @param	string action
 * 
 * @return	object
 */
export const suggestMovieFormReducer = ( state = suggestMovieInitialState, action ) =>
{
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
	}
};

/**
 * @brief	Reducer managing state for the main screen welcome message
 * 
 * @param	string state
 * @param	string action
 * 
 * @return	string
 */
export const welcomeMessageReducer = ( state = { message: '', image: '' }, action ) =>
{
	switch( action.type )
	{
		case 'WELCOME_MESSAGE':
			return { message: action.payload.message, image: action.payload.image };
		default:
			return state;
	}
};

/**
 * @brief	Reducer managing state for the about us screen message
 * 
 * @param	string state
 * @param	string action
 * 
 * @return	string
 */
export const aboutUsMessageReducer = ( state = '', action ) =>
{
	switch( action.type )
	{
		case 'ABOUT_US_MESSAGE':
			return {message: action.payload};
		default:
			return state;
	}
};

