import React, { Component }						from 'react';
import { Provider, connect }					from 'react-redux';
import { GraphRequest, GraphRequestManager }	from 'react-native-fbsdk';
import { createStore, applyMiddleware }			from 'redux';
//import createLogger from 'redux-logger';
import firebase, {firebaseRef}					from './firebase';
import ReduxThunk								from 'redux-thunk';
import reducers									from './reducers';
import Router									from './Router';

import * as mainActions							from './actions/mainActions';

/////////////////////////////////////////////////////DEBUG REDUX////////////////////////////////////////////////////////
//To get redux state debug info (in 'Debug JS Remotely')- uncomment the 'import createLogger from 'redux-logger';'
//and 'const logger = createLogger();'
//Then put the logger as an additional middware in the applyMiddleware.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//const logger = createLogger();

const store	= createStore( reducers, {}, applyMiddleware( ReduxThunk ) );

/**
 * @brief	Main App Component
 */
class App extends Component
{
	/**
	 * @brief	Sets the default user state
	 */
	constructor()
	{
		super();
		this.state	= { user: null };
	}

	/**
	 * @brief	Sets a listener on firebase for auth state and dispatches actions according to that
	 *
	 * @return	void
	 */
	componentWillMount()
	{
		this.unsubscribe	= firebase.auth().onAuthStateChanged( ( userInfo ) =>
			{
				if ( userInfo )
				{
					this.setState( { user: userInfo } );
				}
				else
				{
					store.dispatch( mainActions.logout() );
					this.setState( { user:null } );
				}
			}
		);
	}

	/**
	 * @brief	Removes auth listener and sets user state to null on component dismount
	 */
	componentWillUnmount()
	{
		this.unsubscribe();
		this.setState( { user:null } );
	}

	/**
	 * @brief	Callback given to the Facebook's Graph request that acquires user info
	 *
	 * @details	On success	- Checks if there's available email from facebook and sets it in the user state along with
	 * 						the rest of the user details
	 * 			On failure	- Logs the user with his data that is already in state
	 *
	 * 			Additional info: More often than not Facebook doesn't provide the user's email
	 * 			(even though the user has given that permission) for various reasons. That's why this graph request is
	 * 			made even though the app already has the other data for the user - to try to get the user's email
	 * 			if it gets available and to keep the user's data updated.
	 *
	 * @param	object error
	 * @param	object response
	 *
	 * @return	void
	 */
	graphRequestCallback( error, response )
	{
		let { dispatch }					= this.props;
		let email							= null;
		let {uid, displayName, photoURL}	= this.state.user;
		let id								= this.state.user.providerData[0].uid;

		if ( error )
		{
			email	= this.state.user.providerData[0].email || null;

			this.loginUser( uid, id, displayName, email, photoURL );
		}
		else
		{
			if ( response.email )
			{
				email	= response.email;
				this.state.user.updateEmail( email ).catch( () => {} );
			}
			else if ( this.state.user.providerData[0].email )
			{
				email	= this.state.user.providerData[0].email;
			}

			this.loginUser( uid, id, displayName, email, photoURL );
		}
	}

	/**
	 * @brief	Logs the user into the app
	 *
	 * @param	string uid
	 * @param	string id
	 * @param	string displayName
	 * @param	string email
	 * @param	string photoURL
	 *
	 * @return	void
	 */
	loginUser( uid, id, displayName, email, photoURL )
	{
		store.dispatch( mainActions.login( {uid, id, displayName, email, photoURL} ) );

			if( id !== '' )
			{
				store.dispatch( mainActions.sending() );
				firebaseRef.child( 'users/' + uid ).on( 'value', ( snapshot ) =>
				{
					if( snapshot !== null )
					{
						let watchedMovies	= snapshot.val();

						store.dispatch( mainActions.startStoreWatchedMovies( watchedMovies ) );
						store.dispatch( mainActions.sendingSuccess() );
					}
					else
					{
						store.dispatch( mainActions.sendingSuccess() );
					}
				});
			}
	}

	/**
	 * @brief	Renders the application and executes the Graph request to Facebook
	 */
	render()
	{
		let { dispatch } = this.props;

		if ( this.state.user !== null )
		{
			let req = new GraphRequest( 
				'/me',
				{
					httpMethod: 'GET',
					version: 'v2.8',
					parameters: {
						'fields': {
							'string' : 'name,email'
						}
					}
				},
				this.graphRequestCallback.bind( this )
			);

			new GraphRequestManager().addRequest( req ).start();
		}

		return (
			<Provider store={store}>
				<Router />
			</Provider>
		);
	}
}

export default App;
