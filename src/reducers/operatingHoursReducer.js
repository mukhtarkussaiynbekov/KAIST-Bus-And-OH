import { CHANGE_FACILITY, CHANGE_OH_DAY } from '../constants';
import optionsLocal from '../json/operatingHoursData/operatingHoursOptions.json';
import operatingHoursLocal from '../json/operatingHoursData/operatingHours.json';

const INITIAL_STATE = {
	database: {
		options: optionsLocal,
		operatingHours: operatingHoursLocal
	},
	dayType: 0, // today
	facility: 0
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
