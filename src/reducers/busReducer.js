import busOptionsLocal from '../json/busData/busOptions.json';
import busTimetableLocal from '../json/busData/busTimetable.json';
import busTravelTimesLocal from '../json/busData/busTravelTimes.json';
import specialHolidaysLocal from '../json/specialHolidays.json';
import {
	NAME_ID,
	ID,
	DAY_TYPES,
	TODAY,
	BUS_TYPES,
	CAMPUS_STOPS,
	MAIN_CAMPUS,
	MUNJI,
	SWAP_STOPS,
	CHANGE_TYPE,
	CHANGE_FROM,
	CHANGE_TO,
	CHANGE_DAY,
	DATA_FETCH_SUCCESS
} from '../constants';
import { getPropValue } from '../helperFunctions/commonFunctions';

const INITIAL_STATE = {
	database: {
		busOptions: busOptionsLocal,
		timetableAll: busTimetableLocal,
		travelTimes: busTravelTimesLocal,
		specialHolidays: specialHolidaysLocal.dates
	},
	busType: getPropValue(busOptionsLocal[BUS_TYPES], CAMPUS_STOPS, NAME_ID, ID),
	dayType: getPropValue(busOptionsLocal[DAY_TYPES], TODAY, NAME_ID, ID),
	from: getPropValue(busOptionsLocal[CAMPUS_STOPS], MAIN_CAMPUS, NAME_ID, ID),
	to: getPropValue(busOptionsLocal[CAMPUS_STOPS], MUNJI, NAME_ID, ID)
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
