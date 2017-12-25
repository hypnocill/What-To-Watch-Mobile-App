import React, { Component } from							'react';
import { StyleSheet, Text, View, TouchableOpacity } from	'react-native';
import { connect } from										'react-redux';
import { Actions } from										'react-native-router-flux';
import Icon from											'react-native-vector-icons/FontAwesome';

import Spinner from		'./common/Spinner';
import SingOut from		'./common/SingOut';
import myStyles from	'../styles/AppStyles';
import BigButton from	'./BigButton';
import ListMovies from	'./ListMovies';

class Lists extends Component
{
	showSingOut()
	{
		let { loggedUser }	= this.props;

		if( loggedUser.user.id !== '' )
		{
			return(
				<SingOut/>
			);
		};
	}

	renderScreen()
	{
		let { loading }	= this.props;

		if( ( this.props.loggedUser.user.id !== '' )
			&& (this.props.loggedUser.WatchedMovies !== null )
			&& ( loading === false )
		){
			return <ListMovies/>;
		}
		else if( ( this.props.loggedUser.user.id !== '' )
				&& ( this.props.loggedUser.WatchedMovies === null )
				&& ( loading === false )
		){
			return ( <Text style={styles.welcome}>За да добавиш филми към този списък, отиди в началното
						меню <Icon name="film" size={15} color={myStyles.primaryColor}/> и
						натисни бутона 'Не показвай повече' след като видиш препоръка на филм.
					</Text>
			);
		}
		else if( loading )
		{
			return <Spinner size={100} color={myStyles.primaryColor}/>
		}
		else
		{
			return(
				<View>
					<Text style={styles.welcome}>За да видиш своя списък от филми или да добавяш към него, 
						трябва първо да се впишеш чрез Facebook
					</Text>
					<TouchableOpacity onPress={() => Actions.modal()} style={styles.buttonStyle}>
						<Text style={styles.textStyle} >Искам да продължа</Text>
					</TouchableOpacity>
				</View>
			)
		};
	}

	render()
	{
		return(
			<View style={styles.container}>
				{this.renderScreen()}
				{this.showSingOut()}
			</View>
		);
	}
}

const styles	= StyleSheet.create({
	container:
	{
		paddingTop:			108,
		flex:				1,
		alignItems:			'center',
		backgroundColor:	'#FFFFFF'
	},
	buttonStyle:
	{
		alignSelf:			'stretch',
		backgroundColor:	myStyles.buttonBackground,
		borderRadius:		2,
		borderWidth: 		1,
		borderRadius:		2,
		borderColor: 		'#ddd',
		borderBottomWidth:	1,
		shadowColor: 		'#000',
		shadowOffset: 		{ width: 0, height: 2 },
		shadowOpacity:		0.1,
		shadowRadius:		2,
		elevation: 			1,
		padding: 			6,
		paddingLeft:		10,
		paddingRight:		10,
		margin:				5
	},
	textStyle:
	{
		alignSelf:		'center',
		color:			'#FFFFFF',
		fontSize:		14,
		fontWeight:		'300',
		paddingTop:		5,
		paddingBottom:	5
	},
	welcome:
	{
		fontSize:	20,
		textAlign:	'center',
		margin:		10,
		color: 		'#000000'
	},
});

export default connect( ( state ) =>
	{
		return {
			loading: state.Loading,
			loggedUser: state.LoggedUser
		};
	}
)( Lists );
