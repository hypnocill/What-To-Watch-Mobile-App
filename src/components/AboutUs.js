import React, { Component }					from 'react';
import { connect }							from 'react-redux';
import { Actions }							from 'react-native-router-flux';
import
{
	StyleSheet, Text, View, ScrollView,
	Image, TouchableOpacity
}											from 'react-native';

import axios								from 'axios';
import firebase, {firebaseRef, FBprovider}	from 'firebase';

import * as mainActions						from '../actions/mainActions';
import myStyles								from '../styles/AppStyles';
import SingOut								from './common/SingOut';
import Spinner								from './common/Spinner';

class AboutUs extends Component
{
	constructor( props )
	{
		super( props );
	}

	componentWillMount()
	{
		let { dispatch }	= this.props;

		dispatch( mainActions.startFetchAboutUsMsg() );
	}

	renderScreen()
	{
		let { dispatch, loading }	= this.props;

		if( loading )
		{
			return <Spinner size={100} color={myStyles.primaryColor}/>;
		}
		else
		{
			return (
				<View style={{alignSelf: 'stretch'}}>
					{ this.renderAboutUsMessage() }
				</View>
			);
		}
	}

	renderAboutUsMessage()
	{
		let { aboutUsMsg }	= this.props;
		let message			= aboutUsMsg.message;

		if( aboutUsMsg )
		{
			return (
				<Text style={{textAlign: 'left', padding: 10}}>
					{ message }
				</Text>
			);
		}

		return <Spinner size={30} color={myStyles.primaryColor}/>;
	}

	showSingOut()
	{
		let { loggedUser }	= this.props;

		if( loggedUser.user.id !== '')
		{
			return(
				<SingOut />
			);
		};
	}

	render()
	{
		return (
			<View style={{flex: 1}}>
				<ScrollView contentContainerStyle={styles.container}>
					{ this.renderScreen() }
				</ScrollView>
				{ this.showSingOut() }
			</View>
		);
	}
}

const styles	= StyleSheet.create({
	container:
	{
		paddingTop:			108,
		backgroundColor:	'#FFFFFF',
		justifyContent:		'flex-start',
		alignItems:			'center'
	},
	welcome:
	{
		fontSize:	20,
		textAlign:	'center',
		margin:		10,
		color:		'#000000',
	},
	textStyle:
	{
		alignSelf:		'center',
		color:			'#FFFFFF',
		fontSize:		16,
		fontWeight:		'300',
		paddingTop:		5,
		paddingBottom:	5,
	},
	buttonStyle:
	{
		alignSelf:			'center',
		backgroundColor:	myStyles.buttonBackground,
		borderRadius:		2,
		paddingLeft:		6,
		paddingRight:		6,
		margin:				4,
	}
});

export default connect( ( state ) =>
	{
		return {
			loading:		state.Loading,
			loggedUser:		state.LoggedUser,
			aboutUsMsg:		state.AboutUsMessage
		};
	}
)( AboutUs );
