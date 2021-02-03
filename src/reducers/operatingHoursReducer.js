import { DAY_TYPES, FACILITIES } from '../constants';
import optionsLocal from '../json/operatingHoursData/operatingHoursOptions.json';

const INITIAL_STATE = {
	database: {
		options: optionsLocal,
		realTimeDatabase: {}
	},
	dayType: {
		selected: 0, // today
		items: optionsLocal[DAY_TYPES]
	},
	facility: {
		selected: 0,
		items: optionsLocal[FACILITIES]
	}
};

export default (state = INITIAL_STATE, action) => {
	return state;
};
