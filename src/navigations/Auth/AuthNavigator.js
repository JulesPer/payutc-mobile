/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import AuthScreen from '../../screens/Auth/AuthScreen';

const AuthNavigator = createStackNavigator(
	{
		Auth: AuthScreen,
	},
	{}
);

export default AuthNavigator;
