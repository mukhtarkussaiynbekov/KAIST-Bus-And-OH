import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './src/screens/HomeScreen';
import BusScreen from './src/screens/BusScreen';
import OperatingHoursScreen from './src/screens/OperatingHoursScreen';
import { Provider } from 'react-redux';
import { store } from './src/store/index';

const navigator = createStackNavigator(
	{
		Home: HomeScreen,
		Bus: BusScreen, // Bus Timetable Screen
		OperatingHours: OperatingHoursScreen // Operating Hours Screen
	},
	{
		initialRouteName: 'Home',
		defaultNavigationOptions: {
			title: 'Home'
		}
	}
);

const App = createAppContainer(navigator);

export default () => {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};
