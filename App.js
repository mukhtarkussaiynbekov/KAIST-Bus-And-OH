import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './src/screens/HomeScreen';
import BusScreen from './src/screens/BusScreen';
import OHScreen from './src/screens/OHScreen';

const navigator = createStackNavigator(
  {
    Home: HomeScreen,
    Bus: BusScreen, // Bus Timetable Screen
    OH: OHScreen // Operating Hours (OH) Screen
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      title: 'Home'
    }
  }
);

export default createAppContainer(navigator);