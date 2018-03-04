import React, { Component }						from 'react';
import { Text, View, TouchableNativeFeedback }	from 'react-native';
import { Router, Scene, Actions }				from 'react-native-router-flux';
import Icon										from 'react-native-vector-icons/FontAwesome';
import { connect }								from 'react-redux';
import firebase									from 'firebase';

import Main										from './components/Main';
import AboutUs									from './components/AboutUs';
import Suggest									from './components/Suggest';
import Lists									from './components/Lists';
import ModalScreen								from './components/ModalScreen';
import ModalSuggest								from './components/ModalSuggest';
import ModalNothingToShow						from './components/ModalNothingToShow';
import styles									from './styles/AppStyles';

// Simple component to render something in place of icon
const TabIcon = ( { selected, title, iconName } ) =>
{
	return (
		<View>
			<Icon name={iconName} color={selected ? styles.primaryColor : styles.secondaryColor} size={20} />
		</View>
	);
};

class Routing extends Component
{

	componentDidMount()
	{
		Actions.Second();
	}

	render()
	{
		return (
			<Router navigationBarStyle={{
				  height: 54,
				  borderBottomWidth: 0,
				  elevation: 2,
				  backgroundColor: styles.primaryColor,

				}}
				titleStyle={{color: '#ffffff'}}
			  >
				<Scene key="root" >
				  {/* Tab Container */}


				  <Scene
					key="tabbar"
					tabs={true}
					tabBarStyle={{
					  backgroundColor: '#FFFFFF',
					  top: 54,
					  borderWidth: 1,
					  borderRadius: 0,
					  borderColor: '#ddd',
					  borderBottomWidth: 0,
					  shadowColor: '#000',
					  shadowOffset: { width: 0, height: 2 },
					  shadowOpacity: 0.1,
					  shadowRadius: 2,
					  elevation: 3
					}}


				  >
					{/* Tab and it's scenes */}
					<Scene key="First" title="First" iconName="list" icon={TabIcon}>
					  <Scene
						key="lists"
						component={Lists}
						title="Моят списък"
					  />
					</Scene>

					{/* Tab and it's scenes */}
					<Scene key="Second" title="Second" iconName="film" icon={TabIcon} >
					  <Scene
						key="main"
						component={Main}
						title="Какво да гледам?"



					  />
					</Scene>

					{/* Tab and it's scenes */}
					<Scene key="Third" title="Third" iconName="send" icon={TabIcon} >
					  <Scene
						key="suggest"
						component={Suggest}
						title="Препоръчай филм"

					  />
					</Scene>

					{/* Tab and it's scenes */}
					<Scene key="Fourth" title="Fourth" iconName="info" icon={TabIcon} >
					  <Scene
						key="aboutus"
						component={AboutUs}
						title="За приложението"

					  />
					</Scene>

				  </Scene>

				  <Scene
					key="modal"
					direction="vertical"
					component={ModalScreen}
					title="Modal"
					hideNavBar
				  />

				  <Scene
					key="modalSuggest"
					direction="vertical"
					component={ModalSuggest}
					title="ModalSuggest"
					hideNavBar
				  />

				  <Scene
					key="ModalNothingToShow"
					direction="vertical"
					component={ModalNothingToShow}
					title="ModalNothingToShow"
					hideNavBar
				  />
				</Scene>
			</Router>
		);
	}
}

export default Routing;
