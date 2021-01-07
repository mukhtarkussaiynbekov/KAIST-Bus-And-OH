import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
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

export default createAppContainer(navigator);