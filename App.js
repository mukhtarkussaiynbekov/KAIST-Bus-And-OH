import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './src/screens/HomeScreen';
import BusScreen from './src/screens/BusScreen';
import OperatingHoursScreen from './src/screens/OperatingHoursScreen';
import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyDW-h7c2D--spXqQ-mB04nV6cr10lTghiQ',
	authDomain: 'kaist-times.firebaseapp.com',
	databaseURL: 'https://kaist-times-default-rtdb.firebaseio.com',
	projectId: 'kaist-times',
	storageBucket: 'kaist-times.appspot.com',
	messagingSenderId: '261995898468',
	appId: '1:261995898468:web:3135e964eb420b0246a171',
	measurementId: 'G-0SXVPGY5YK'
};

firebase.initializeApp(firebaseConfig);

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

export default createAppContainer(navigator);
