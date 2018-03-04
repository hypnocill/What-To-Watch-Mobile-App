import { AppRegistry } from 'react-native';
import App from './src/App';

/**
 * @brief	Registers the app React component
 *
 * @todo	1. Implement the 'Year' filter search once there's enough movies to make it worthwhile
 * 			2. Cleanup styles and redundancy in all components
 * 			3. Add documentation to all files
 * 
 * @return	ReactElement App
 */
AppRegistry.registerComponent( 'WhatToWatchApp', () => App );
