import React, { Component } from														'react';
import { Text, TouchableWithoutFeedback, TouchableOpacity, View, LayoutAnimation } from	'react-native';
import { connect } from																	'react-redux';
import Icon from																		'react-native-vector-icons/FontAwesome';

import CardSection from			'./common/CardSection';
import * as mainActions from	'../actions/mainActions';

class ListItem extends Component {

	render()
	{
		const { titleStyle, textStyle }	= styles;
		const { key, title, year }		= this.props.watchedMovies;
		let { dispatch }				= this.props;

		return (
			<View style={{flexDirection: 'row'}}>
				<CardSection style={{flex: 1, padding: 12}}>
					<Text style={titleStyle}>
						{title}
						<Text style={textStyle}>
							{' ' + year}
						</Text>
					</Text>
				</CardSection>
				<TouchableOpacity style={{alignSelf: 'center'}} onPress={() => dispatch(mainActions.startRemoveWatchedMovie(key))}>
					<Icon style={{alignSelf: 'center'}} name="times" size={35} color="#F44336" />
				</TouchableOpacity>
			</View>
		);
	}
}

const styles	=
{
	titleStyle:
	{
		fontSize:	18,
		fontWeight:	'500'
	},
	textStyle:
	{
		fontSize:	14,
		fontWeight:	'300'
	},
	descriptionStyle:
	{
		paddingLeft:	10,
		paddingRight:	10
	}
};

export default connect()( ListItem );
