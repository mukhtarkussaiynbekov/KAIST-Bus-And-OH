import optionsLocal from '../json/operatingHoursData/operatingHoursOptions.json';
import operatingHoursLocal from '../json/operatingHoursData/operatingHours.json';
import specialHolidaysLocal from '../json/specialHolidays.json';
import {
	CHANGE_FACILITY,
	CHANGE_OH_DAY,
	DAY_TYPES,
	FACILITIES,
	ID,
	NAME_ID,
	NORTH_MEJOM,
	TODAY
} from '../constants';
import { getPropValue } from '../helperFunctions/commonFunctions';

const INITIAL_STATE = {
	database: {
		options: optionsLocal,
		operatingHours: operatingHoursLocal,
		specialHolidays: specialHolidaysLocal.dates
	},
	dayType: getPropValue(optionsLocal[DAY_TYPES], TODAY, NAME_ID, ID),
	facility: getPropValue(optionsLocal[FACILITIES], NORTH_MEJOM, NAME_ID, ID)
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHANGE_OH_DAY:
			return { ...state, dayType: action.payload };
		case CHANGE_FACILITY:
			return { ...state, facility: action.payload };
		default:
			return state;
	}
};
