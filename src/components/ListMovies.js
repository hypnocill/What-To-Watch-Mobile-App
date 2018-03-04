import React, { Component }			from 'react';
import { ListView, View, Alert }	from 'react-native';
import { connect }					from 'react-redux';
import { Actions }					from 'react-native-router-flux';

import ListItem						from './ListItem';
import BigButton					from './BigButton';
import * as mainActions				from '../actions/mainActions';

class ListMovies extends Component
{
	askForConfirm()
	{
		let { dispatch }	= this.props;

		Alert.alert(
			'СЪОБЩЕНИЕ',
			'Премахни всички филми от моя списък?',
			[
				{text: 'Отказвам се', onPress: () => {}},
				{text: 'Да', onPress: () => dispatch(mainActions.startRemoveAllWatchedMovies())},
			],
			{ cancelable: true }
		);
	}

	renderRow( movieObj )
	{
		return <ListItem watchedMovies={movieObj} />;
	}

	render()
	{
		const ds			= new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});

		const movieObj		= this.props.loggedUser.WatchedMovies ? this.props.loggedUser.WatchedMovies : {};

		this.dataSource		= ds.cloneWithRows( movieObj );

		let watchedMovies	= this.props.loggedUser.WatchedMovies;

		return (
			<View style={{flex: 1, width: '90%'}}>
				<ListView enableEmptySections dataSource={this.dataSource} renderRow={this.renderRow}/>
				<BigButton onPress={ this.askForConfirm.bind( this ) }>Премахни всички от списъка</BigButton>
			</View>

		);
	}
}

export default connect( ( state ) =>
	{
		return {
			loading: state.Loading,
			loggedUser: state.LoggedUser
		};
	}
)( ListMovies );
