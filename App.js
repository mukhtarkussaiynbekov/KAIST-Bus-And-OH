import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import { store, persistor } from './src/store/index';
import HomeScreen from './src/screens/HomeScreen';
import BusScreen from './src/screens/BusScreen';
import OperatingHoursScreen from './src/screens/OperatingHoursScreen';

const navigator = createStackNavigator(
	{
		Home: HomeScreen,
		Bus: BusScreen, // Bus Timetable Screen
		OperatingHours: OperatingHoursScreen // Operating Hours Screen
	},
	{
		initialRouteName: 'Home',
		defaultNavigationOptions: {
			title: 'Home',
			headerStyle: {
				backgroundColor: 'rgb(65, 59, 152)!important'
			},
			headerTitleStyle: {
				color: 'white'
			}
		}
	}
);

const App = createAppContainer(navigator);

export default () => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	);
};
