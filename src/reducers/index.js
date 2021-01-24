import { combineReducers } from 'redux';
import busReducer from './busReducer';
import operatingHoursReducer from './operatingHoursReducer';

export default combineReducers({
	bus: busReducer,
	operatingHours: operatingHoursReducer
});
