import React, { Component } from									'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from	'react-native';
import { Actions } from												'react-native-router-flux';

import FacebookLoginButton from './FacebookLoginButton';
import myStyles from			'../styles/AppStyles';
import ModalButton from			'./common/ModalButton';

class Modal extends Component
{
	render()
	{
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					За да продължиш, трябва да се впишеш чрез Facebook.
					Вписвайки се, ще можеш да отбелязваш кои филми си гледал, за да не ти бъдат препоръчвани отново.
					Също така, ти самият ще можеш да препоръчваш филми и да споделиш най-добрите си впечатления от тях с другите потребители!
				</Text>
				<FacebookLoginButton />
				<ModalButton onPress={() => Actions.pop()}>Скрий</ModalButton>
			</View>
		);
	}
}

const styles	= StyleSheet.create({
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
		margin:		10,
	}
});

export default Modal;
