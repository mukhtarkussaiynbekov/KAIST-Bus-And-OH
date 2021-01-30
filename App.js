import React, { useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import { store, persistor } from './src/store/index';
import { getUpdates } from './src/firebase';
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
			title: 'Home'
		}
	}
);

const App = createAppContainer(navigator);

export default () => {
	useEffect(() => {
		getUpdates(store.dispatch);
	}, []);
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	);
};
