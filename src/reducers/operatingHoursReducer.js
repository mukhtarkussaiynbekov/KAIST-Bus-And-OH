import optionsLocal from '../json/operatingHoursData/operatingHoursOptions.json';

const INITIAL_STATE = {
	database: {
		options: optionsLocal,
		realTimeDatabase: {}
	},
	dayType: 0, // today
	facility: 0
};

export default (state = INITIAL_STATE, action) => {
	return state;
};
