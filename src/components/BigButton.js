import React from						'react';
import { Text, TouchableOpacity } from	'react-native';

import myStyles from	'../styles/AppStyles';

const BigButton = (props) =>
{
	const { buttonStyle, textStyle }	= styles;

	return (
		<TouchableOpacity onPress={props.onPress} disabled={props.disabled} style={{...buttonStyle, height: props.height}}>
			<Text style={textStyle}>
				{props.children}
			</Text>
		</TouchableOpacity>
	);
};

const styles	=
{
	textStyle:
	{
		alignSelf:		'center',
		color:			'#ffffff',
		fontSize:		20,
		fontWeight:		'100',
		paddingTop:		10,
		paddingBottom:	10
	},
	buttonStyle:
	{
		justifyContent:		'center',
		flex:				0,
		alignSelf:			'stretch',
		backgroundColor:	myStyles.mainButton,
		borderWidth:		1,
		borderRadius:		2,
		borderColor:		'#ddd',
		borderBottomWidth:	1,
		shadowColor:		'#000',
		shadowOffset:		{ width: 0, height: 2 },
		shadowOpacity:		0.1,
		shadowRadius:		2,
		elevation:			1,
		marginLeft:			5,
		marginRight:		5,
		marginTop:			10,
		marginBottom:		10
	}
};

export default BigButton;
