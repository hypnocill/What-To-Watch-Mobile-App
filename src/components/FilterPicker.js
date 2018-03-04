import React, { Component }	from 'react';
import { View, Picker }		from 'react-native';
import { connect }			from 'react-redux';

import config				from '../config/mainConfig';
import myStyles				from '../styles/AppStyles';
import * as mainActions		from '../actions/mainActions';

class FilterPicker extends Component
{
	constructor()
	{
		super();
	}

	renderPickerItems( item )
	{
		return (
			<Picker.Item label={ item.name } value={ item.value } key={ item.name + item.value } color="#424242" />
		);
	}

	genrePicker()
	{
		return (
			<View style={{ 'flex': 0.5, 'backgroundColor': myStyles.filterButtons, 'marginRight': 50, 'marginLeft': 50}} >
				<Picker
					style={{ 'flex': 1 }}
					selectedValue={ this.props.filterState.genre }
					onValueChange={ ( itemValue, itemIndex ) =>
						{
							this.props.dispatch( mainActions.clearAlreadySuggestedMovieKeys() );
							this.props.dispatch( mainActions.setGenreFilter( itemValue ) ); 
						}
					}
					prompt='Избери Жанр'
				>
				{ config.genres.map( this.renderPickerItems ) }
				</Picker>
			</View>
		);
	}

	yearPicker()
	{
		return (
			<View style={{ 'flex': 0.5, 'backgroundColor': myStyles.filterButtons, 'marginLeft': 5 }}>
				<Picker
					style={{ 'flex': 1 }}
					selectedValue={ this.props.filterState.years }
					onValueChange={ ( itemValue, itemIndex ) =>
						{
							this.props.dispatch( mainActions.clearAlreadySuggestedMovieKeys() );
							this.props.dispatch( mainActions.setYearFilter( itemValue ) );
						}
					}
					prompt='Избери Период'
				>
				{ config.years.map( this.renderPickerItems ) }
				</Picker>
			</View>
		);
	}

	render()
	{
		return (
			<View style={{ 'flex': 1, 'flexDirection': 'row', 'paddingLeft': 6, 'paddingRight': 6 }}>
				{ this.genrePicker() }
				{/*	Year Filter is currently not active. When it's activated it should be placed here,
					then the margins of the genrePicker should be fixed */}
			</View>
		);
	}
};

export default connect( ( state ) =>
	{
		return {
			filterState: state.Filter
		}
	}
)( FilterPicker );
