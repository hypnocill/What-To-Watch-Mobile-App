import React, { Component } 										from 'react';
import { Alert, StyleSheet, Text, View, Button, TouchableOpacity }	from 'react-native';
import { LoginManager, LoginButton, AccessToken } 					from 'react-native-fbsdk';
import { Actions } 													from 'react-native-router-flux';

import firebase, { FBprovider }										from '../firebase';

class FacebookLoginButton extends Component
{
	constructor( props )
	{
		super();
		this.state = { erorr: false };
	}

	render()
	{
		const auth		= firebase.auth();
		const provider	= firebase.auth.FacebookAuthProvider;

		return (
			<LoginButton
				readPermissions={["public_profile", "email"]}
				onLoginFinished={ ( error, result ) =>
					{
						if ( error )
						{
							Alert.alert(
								'Грешка',
								'Има проблем при вписването - ' + error +
								'\nOпитай отново или пиши на hypnocill@gmail.com с описание на проблема.',
								[
									{text: 'Добре', onPress: () => {}}
								],
								{ cancelable: true }
							);

							this.setState( { error: true } );
						}
						else if( result.isCancelled )
						{
							Alert.alert(
								'Съобщение',
								'Вписването беше отказано.' +
								'\nOпитай отново или пиши на hypnocill@gmail.com, ако е възникнал проблем.',
								[
									{text: 'Добре', onPress: () => {}}
								],
								{ cancelable: true }
							);

							this.setState( { error: true } );
						}
						else
						{
							if ( result.declinedPermissions.length > 0 )
							{
								LoginManager.logOut();

								Alert.alert(
									'Грешка',
									'За да се логнеш, трябва да дадеш разрешение за ползване на твоя и-мейл.' +
									'\nТо ще бъде използвано единствено за изпращане на известия при твоя ' +
									'препоръка на филм или новости около приложението.',
									[
										{text: 'Добре', onPress: () => {}}
									],
									{ cancelable: true }
								);

								this.setState( { error: true } );
								return;
							}
							AccessToken.getCurrentAccessToken().then( ( data ) =>
								{
									const { accessToken }	= data;
									const credential		= provider.credential( accessToken );

									return auth.signInWithCredential( credential );
								}
							).then( ( credData ) =>
								{
									Actions.pop();
								}
							).catch( ( err ) =>
								{
									let errorCode		= err.code;
									let errorMessage	= err.message;

									Alert.alert(
										'Грешка',
										'Има проблем с базата данни - ' + errorCode +
										'\nOпитай отново или пиши на hypnocill@gmail.com с описание на проблема',
										[
											{text: 'Добре', onPress: () => {}}
										],
										{ cancelable: true }
									);

									this.setState( { error: true } );
								}
							);
						}
					}
				}
				onLogoutFinished={() =>
					{
						auth.signOut();

						this.state.error ? null : Actions.pop();
					}
				}
			/>
		);
	}
}

export default FacebookLoginButton;