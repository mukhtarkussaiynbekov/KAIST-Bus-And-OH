import { DATES, HOLIDAYS, DATA_FETCH_SUCCESS } from '../constants';
import holidaysLocal from '../json/holidays.json';

const INITIAL_STATE = holidaysLocal[DATES];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case DATA_FETCH_SUCCESS:
			const holidays = action.payload[HOLIDAYS];
			return holidays === undefined ? [] : holidays[DATES];
		default:
			return state;
	}
};
