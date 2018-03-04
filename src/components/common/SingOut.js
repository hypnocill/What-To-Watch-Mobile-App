import React, { Component }								from 'react';
import { Text, TouchableOpacity, Alert, Image, View }	from 'react-native';
import { LoginManager, LoginButton, AccessToken }		from 'react-native-fbsdk';
import { connect }										from 'react-redux';

import firebase,  {firebaseRef, FBprovider}				from '../../firebase';
import myStyles											from '../../styles/AppStyles';
import Spinner											from './Spinner';

class SingOut extends Component
{
	askForConfirm()
	{
		Alert.alert(
			'СЪОБЩЕНИЕ',
			'Сигурен ли си, че искаш да се отпишеш?',
			[
				{text: 'Отказвам се', onPress: () => {}},
				{text: 'Да, отпиши ме', onPress: () => this.handleFacebookLogin()},
			],
			{ cancelable: true }
		);
	}

	handleFacebookLogin()
	{
		LoginManager.logOut();
		firebase.auth().signOut();
	}

	render()
	{
		const auth	= firebase.auth();

		let { dispatch, loading, loggedUser }	= this.props;
		let { id }								= loggedUser.user;
		let photoURL							= "http://graph.facebook.com/v2.8/" + id + "/picture";

		return (
			<View style={{flexDirection: 'row', marginBottom: 5, marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
				{
					photoURL ?
					<Image	style={{width: 35, height: 35, borderRadius: 17.5, marginRight: 10}} source={{uri: photoURL}} /> :
					<Spinner size={20} color={myStyles.primaryColor}/>
				}
				<TouchableOpacity onPress={() => this.askForConfirm()} >
					<Text>Отпиши ме</Text>
				</TouchableOpacity>
			</View>
		);
	}
};

const styles	=
{
	textStyle:
	{
		alignSelf:		'center',
		color:			'#007aff',
		fontSize:		16,
		fontWeight:		'600',
		paddingTop:		10,
		paddingBottom:	10
	},
	buttonStyle:
	{
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: '#fff',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#007aff',
		marginLeft: 5,
		marginRight: 5
	}
};

export default connect( ( state ) =>
	{
		return {
			loading:		state.Loading,
			loggedUser:		state.LoggedUser
		};
	}
)( SingOut );
