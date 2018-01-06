import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { createStore, applyMiddleware } from 'redux';
//import createLogger from 'redux-logger';
import firebase, {firebaseRef} from './firebase';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Router from './Router';

import * as mainActions from './actions/mainActions';

//const logger = createLogger();

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class App extends Component
{
	constructor()
	{
		super();
		this.state	= { user: null };
	}

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

	componentWillUnmount()
	{
		this.unsubscribe();
		this.setState( { user:null } );
	}

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
