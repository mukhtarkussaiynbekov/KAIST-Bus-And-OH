import busOptionsLocal from '../json/busData/busOptions.json';
import busTimetableLocal from '../json/busData/busTimetable.json';
import busTravelTimesLocal from '../json/busData/busTravelTimes.json';
import specialHolidaysLocal from '../json/specialHolidays.json';
import {
	SWAP_STOPS,
	CHANGE_TYPE,
	CHANGE_FROM,
	CHANGE_TO,
	CHANGE_DAY,
	DATA_FETCH_SUCCESS
} from '../constants';

const INITIAL_STATE = {
	database: {
		busOptions: busOptionsLocal,
		timetableAll: busTimetableLocal,
		travelTimes: busTravelTimesLocal,
		specialHolidays: specialHolidaysLocal
	},
	busType: 2, // campuses
	dayType: 0, // today
	from: 0, // main campus
	to: 1 // munji
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		// case DATA_FETCH_SUCCESS:
		// 	return {
		// 		...newState
		// 		busStops: { ...newState.busStops, timetable: getTimetable(newState) }
		// 	};
		case SWAP_STOPS:
			const temp = state.from;
			return { ...state, from: state.to, to: temp };
		case CHANGE_TYPE:
			return { ...state, busType: action.payload, from: 0, to: 1 };
		case CHANGE_DAY:
			return { ...state, dayType: action.payload };
		case CHANGE_FROM:
			return { ...state, from: action.payload };
		case CHANGE_TO:
			return { ...state, to: action.payload };
		default:
			return state;
	}
};
