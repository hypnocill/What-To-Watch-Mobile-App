import React from						'react';
import { View, ActivityIndicator } from	'react-native';

const Spinner = ({ size, color}) =>
{
	return (
		<View style={styles.spinnerStyle}>
			<ActivityIndicator size={size || 'large'} color={color || 'blue'}/>
		</View>
	);
};

const styles	=
{
	spinnerStyle:
	{
		justifyContent:	'center',
		alignItems:		'center',
		margin:			25
	}
};

export default Spinner;
