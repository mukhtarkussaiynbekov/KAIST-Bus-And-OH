import { combineReducers } from 'redux';
import busReducer from './busReducer';
import operatingHoursReducer from './operatingHoursReducer';
import holidaysReducer from './holidaysReducer';

export default combineReducers({
	bus: busReducer,
	operatingHours: operatingHoursReducer,
	holidays: holidaysReducer
});
