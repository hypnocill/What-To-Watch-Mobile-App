import React, { Component } from									'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from	'react-native';
import { LoginManager, LoginButton, AccessToken } from				'react-native-fbsdk';
import { Actions } from												'react-native-router-flux';
import Icon from													'react-native-vector-icons/FontAwesome';

import firebase, { FBprovider } from '../firebase';

import ModalButton from	'./common/ModalButton';
import myStyles from	'../styles/AppStyles';

class ModalNothingToShow extends Component
{
	render()
	{
		const auth		= firebase.auth();
		const provider	= firebase.auth.FacebookAuthProvider;

		return(
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Изглежда, че си маркирал всички филми с 'Не показвай повече'.
					В случай, че е станала грешка, отиди в менюто{" "}
					<Icon name={'list'} color={styles.secondaryColor} size={15} /> и виж кои филми си маркирал.
					Ако пък просто си гледал всички препоръчвани филми досега, защо не отидеш в менюто{" "}
					<Icon name={'send'} color={styles.secondaryColor} size={15} /> и не препоръчаш свой любим филм? 
				</Text>
				<ModalButton onPress={() => Actions.pop()}>Добре</ModalButton>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container:
	{
		flex:				1,
		justifyContent:		'center',
		alignItems:			'center',
		backgroundColor:	myStyles.background
	},
	textStyle:
	{
		alignSelf:	'center',
		color:		'#FFFFFF',
		fontSize:	16,
		fontWeight:	'300'
	},
	welcome:
	{
		fontSize:	18,
		textAlign:	'center',
		margin:		10
	}
});

export default ModalNothingToShow;
