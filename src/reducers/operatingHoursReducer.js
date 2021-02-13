import optionsLocal from '../json/operatingHoursData/operatingHoursOptions.json';
import operatingHoursLocal from '../json/operatingHoursData/operatingHours.json';
import {
	DAY_TYPES,
	FACILITIES,
	ID,
	NAME_ID,
	NORTH_MEJOM,
	TODAY,
	OPERATING_HOURS_DATABASE,
	OPTIONS,
	OPERATING_HOURS,
	DATA_FETCH_SUCCESS,
	CHANGE_OH_DAY,
	CHANGE_FACILITY
} from '../constants';
import { getPropValue } from '../helperFunctions/commonFunctions';

const INITIAL_STATE = {
	database: {
		options: optionsLocal,
		operatingHours: operatingHoursLocal
	},
	dayType: getPropValue(optionsLocal[DAY_TYPES], TODAY, NAME_ID, ID),
	facility: getPropValue(optionsLocal[FACILITIES], NORTH_MEJOM, NAME_ID, ID)
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case DATA_FETCH_SUCCESS:
			const database = action.payload[OPERATING_HOURS_DATABASE];
			return {
				...state,
				database: {
					options: database[OPTIONS],
					operatingHours: database[OPERATING_HOURS]
				}
			};
		case CHANGE_OH_DAY:
			return { ...state, dayType: action.payload };
		case CHANGE_FACILITY:
			return { ...state, facility: action.payload };
		default:
			return state;
	}
};
