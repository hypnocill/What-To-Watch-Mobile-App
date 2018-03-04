import React, { Component }		from 'react';
import
{
	StyleSheet, Text, TextInput, View,
	KeyboardAvoidingView, ScrollView,
	TouchableOpacity, Keyboard, Picker
}
								from 'react-native';
import { Actions }				from 'react-native-router-flux';
import { LoginButton }			from 'react-native-fbsdk';
import Icon						from 'react-native-vector-icons/FontAwesome';
import { connect }				from 'react-redux';

import SingOut					from './common/SingOut';
import Card						from './common/Card';
import Spinner					from './common/Spinner';
import config					from '../config/mainConfig';
import * as mainActions			from '../actions/mainActions';
import myStyles					from '../styles/AppStyles';

class Suggest extends Component
{
	constructor( props )
	{
		super();

		this.state				= { height: 0, behavior: 'position', keyboardOpen: false };
		this.placeHolderColor	= '#9E9E9E';
	}

	componentWillMount()
	{
		this.keyboardDidShowListener	= Keyboard.addListener( 'keyboardDidShow', () => this.setState( { keyboardOpen: true } ) );
		this.keyboardDidHideListener	= Keyboard.addListener( 'keyboardDidHide', () => this.setState( { keyboardOpen: false } ) );
	}

	componentWillUnmount()
	{
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();

		let { dispatch }	= this.props;

		dispatch( mainActions.clearUserSuggestion() );
	}

	validation()
	{
		let { title, year, genre, resume }	= this.props.UserSuggestion;
		let { loggedUser, helperEmail }		= this.props;
		let { email }						= loggedUser.user;
		let emailValidation					= false;

		if ( email )
		{
			emailValidation	= true;
		}
		else if ( helperEmail && helperEmail.indexOf( '@' ) > -1 )
		{
			emailValidation	= true;
		}

		if( ( title.length > 1 ) && ( year.length == 4 ) && ( year.match(/^[0-9]+$/) !== null )
			&& ( genre !== '' ) && ( resume.length > 7 ) && emailValidation )
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	isMovieAlreadySuggested()
	{
		const B = ( props ) => <Text style={{ fontWeight: 'bold' }}>{ props.children }</Text>;

		let { movieAlreadySuggested }	= this.props.UserSuggestion;

		if( movieAlreadySuggested === 'searching' )
		{
			return <Spinner size={30} color={ myStyles.primaryColor } />;
		}
		else if( ( movieAlreadySuggested !== 'searching' ) && ( movieAlreadySuggested !== false ) )
		{
			return (
				<Text style={{color: myStyles.mainButton, textAlign: 'center', padding: 10}}>
					<B>{movieAlreadySuggested.charAt(0).toUpperCase() + movieAlreadySuggested.slice(1)}</B> е вече препоръчван.
					Шансът препоръката ти да бъде публикуванa ще е по-малък,
					което обаче не трябва да те спира да я изпратиш, ако смяташ, че си заслужава!
				</Text>
			);
		}
		else
		{
			return null;
		}
	}

	renderPickerItems( item )
	{
		let myColor	= ( item.value !== '' ) ? null : this.placeHolderColor;

		return (
			<Picker.Item label={ item.name } value={ item.value } key={ item.name + item.value } color={ myColor } />
		);
	}

	showGenrePicker()
	{
		let { genre }		= this.props.UserSuggestion;
		let { dispatch }	= this.props;
		let allGenres		= config.genresForSuggest;

		return(
			<Picker
				style={{ 'flex': 0.5 }}
				selectedValue={ genre }
				onValueChange={ ( itemValue, itemIndex ) => dispatch( mainActions.setGenre( itemValue ) ) }
				prompt='Избери Жанр'
			>
			{ allGenres.map( this.renderPickerItems.bind( this ) ) }
			</Picker>
		);

	}

	showEmailTextInput()
	{
		let { dispatch, loggedUser }	= this.props;
		let { email }					= loggedUser.user;

		if ( ! email )
		{
			return (
				<TextInput
					style={{width: "70%", alignSelf: 'center', borderColor: 'gray', borderWidth: 0, textAlign: 'center'}}
					placeholder="Твоят и-мейл"
					placeholderTextColor={ this.placeHolderColor }
					autoCorrect = {false}
					onChangeText={( text ) =>
						{
							dispatch( mainActions.setEmail( text ) );
						}
					}
				/>
			)
		}
		else
		{
			return null;
		}
	}

	showSuccessMessage()
	{
		const B = ( props ) => <Text style={{ fontWeight: 'bold' }}>{ props.children }</Text>;

		let { loggedUser }	= this.props;
		let { helperEmail }	= this.props;
		let email			= loggedUser.user.email || helperEmail;

		if ( email )
		{
			return (
				<Text style={styles.welcome}>Препоръката ти беше изпратена успешно и скоро ще бъде разгледана!{'\n'}{'\n'}
					Ако бъде одобрена, ще получиш известие на <B>{ email }</B></Text>
			);
		}
		return (
			<Text style={styles.welcome}>Препоръката ти беше изпратена успешно и скоро ще бъде разгледана!
					Ако бъде одобрена, ще бъде публикувана!.{'\n'}{'\n'}
					Приложението не е получило твоя е-мейл, поради това няма как да ти изпрати известие{'\n'}
					Ако имаш някакви въпроси, можеш да пишеш на hypnocill@gmail.com </Text>
		)
	}

	showSingOut()
	{
		let { loggedUser }		= this.props;
		let { keyboardOpen }	= this.state;

		if( loggedUser.user.id !== '' && ! keyboardOpen )
		{
			return(
				<SingOut />
			);
		};
	}

	renderScreen()
	{
		let { dispatch, loggedUser, helperEmail, UserSuggestion, loading}	= this.props;
		let { uid, id, displayName }										= loggedUser.user;
		let { title, year, genre, resume, sent }							= UserSuggestion;

		let email	= loggedUser.user.email || helperEmail;

		if( ( id === '' ) && ( loading === false ) )
		{
			return(
				<View>
					<Text style={styles.welcome}>За да препоръчваш филми, трябва първо да се впишеш чрез Facebook</Text>
					<TouchableOpacity onPress={() => Actions.modalSuggest()} style={styles.buttonStyle}>
						<Text style={styles.textStyle}>Искам да продължа</Text>
					</TouchableOpacity>
				</View>
			)
		}
		else if( ( id != '' ) && ( loading === false ) && ( sent !== true ) )
		{
			return(
				<Card>
					{this.isMovieAlreadySuggested()}
					<TextInput
						style={{width: "70%", alignSelf: 'center', borderColor: 'gray', borderWidth: 0, textAlign: 'center'}}
						placeholder="Име на филма (на латиница)"
						autoCorrect = {false}
						onChangeText={( text ) =>
							{
								dispatch( mainActions.setTitle( text ) );
							}
						}
						onBlur={ () => { dispatch( mainActions.startIsMovieAlreadySuggested() ); } }
					/>

					<View style={{ 'flex': 1, width: "80%", 'flexDirection': 'row', alignSelf: 'center' }} >
						<TextInput
							style={{'flex': 0.3, borderColor: 'gray', borderWidth: 0, textAlign: 'center', 'marginRight': 25, 'marginLeft': 19}}
							placeholder="Година"
							autoCorrect = {false}
							onChangeText={( text ) =>
								{
									dispatch( mainActions.setYear( text ) );
								}
							}
						/>

						{ this.showGenrePicker() }
					</View>

					<TextInput
						style={{width: "90%", marginBottom: 10, marginTop: 10, alignSelf: 'center', borderColor: 'gray',
								borderWidth: 0, height: Math.max(35, this.state.height)}}
						placeholder="Цялата ти препоръка (на кирилица)"
						multiline={true}
						autoCorrect= {false}
						onChange={( event ) =>
							{
								this.setState({height: event.nativeEvent.contentSize.height});
							}
						}
						onChangeText={( text ) =>
							{
								dispatch( mainActions.setResume( text ) );
							}
						}
					/>

					{ this.showEmailTextInput() }

					<TouchableOpacity
						onPress={ () =>
							{
								dispatch( mainActions.sendSuggestionForApproval( title, year, genre, resume, uid, id, displayName, email ) );
								this.setState( { height: 0 } );
							}
						}
						style={this.validation() ? styles.buttonStyle : styles.disabledButtonStyle }
						disabled={this.validation() ? false : true}>
						<Text style={styles.textStyle}>{this.validation() ? "Изпрати" : "Попълни полетата коректно и ще се активирам"}
						</Text>
					</TouchableOpacity>
				</Card>
			)
		}
		else if ( ( sent == true ) && ( id != '' ) && ( loading == false ) )
		{
			return(
				<View style={{justifyContent: 'center', alignItems: 'center',}}>
					{ this.showSuccessMessage() }
					<Icon name="check" size={60} color="#4CAF50" />
					<TouchableOpacity onPress={() => dispatch( mainActions.clearUserSuggestion() )} style={styles.buttonStyle}>
						<Text style={styles.textStyle}>Препоръчай друг филм</Text>
					</TouchableOpacity>
				</View>
			);
		}
		else
		{
			return <Spinner size={100} color={myStyles.primaryColor}/>;
		}
	}

	render()
	{
		return (
			<View style={{flex: 1}}>
			<ScrollView contentContainerStyle={styles.container}>
				{this.renderScreen()}
			</ScrollView>
			{this.showSingOut()}
			</View>
		);
	}

}

const styles	= StyleSheet.create({
	container:
	{
		marginRight:		0,
		marginLeft:			0,
		paddingTop:			108,
		paddingBottom:		5,
		backgroundColor:	'#FFFFFF'
	},
	welcome:
	{
		fontSize:	20,
		textAlign:	'center',
		margin:		10,
		color:		'#000000'
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
	buttonStyle:
	{
		alignSelf:			'stretch',
		backgroundColor:	myStyles.buttonBackground,
		borderRadius:		2,
		borderWidth:		1,
		borderRadius:		2,
		borderColor:		'#ddd',
		borderBottomWidth:	1,
		shadowColor:		'#000',
		shadowOffset:		{ width: 0, height: 2 },
		shadowOpacity:		0.1,
		shadowRadius:		2,
		elevation:			1,
		padding:			6,
		paddingLeft:		10,
		paddingRight:		10,
		margin:				5
	},
	disabledButtonStyle:
	{
		alignSelf:			'stretch',
		backgroundColor:	myStyles.disabledButtonBackground,
		borderRadius:		2,
		borderWidth:		1,
		borderRadius:		 2,
		borderColor:		'#ddd',
		borderBottomWidth:	1,
		shadowColor:		'#000',
		shadowOffset:		{ width: 0, height: 2 },
		shadowOpacity:		0.1,
		shadowRadius:		2,
		elevation:			1,
		padding:			6,
		paddingLeft:		10,
		paddingRight:		10,
		margin:				5
	}
});

export default connect( ( state ) =>
	{
		return {
			loading:		state.Loading,
			loggedUser:		state.LoggedUser,
			helperEmail:	state.HelperEmail,
			UserSuggestion:	state.UserSuggestion
		};
	}
)( Suggest );
