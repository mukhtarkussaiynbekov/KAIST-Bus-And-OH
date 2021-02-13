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
	DATES,
	BUS_DATABASE,
	TIMETABLE,
	TRAVEL_TIMES,
	SPECIAL_HOLIDAYS,
	OPTIONS,
	DATA_FETCH_SUCCESS,
	SWAP_STOPS,
	CHANGE_TYPE,
	CHANGE_DAY,
	CHANGE_FROM,
	CHANGE_TO
} from '../constants';
import { getPropValue } from '../helperFunctions/commonFunctions';

const INITIAL_STATE = {
	database: {
		busOptions: busOptionsLocal,
		timetableAll: busTimetableLocal,
		travelTimes: busTravelTimesLocal,
		specialHolidays: specialHolidaysLocal[DATES]
	},
	busType: getPropValue(busOptionsLocal[BUS_TYPES], CAMPUS_STOPS, NAME_ID, ID),
	dayType: getPropValue(busOptionsLocal[DAY_TYPES], TODAY, NAME_ID, ID),
	from: getPropValue(busOptionsLocal[CAMPUS_STOPS], MAIN_CAMPUS, NAME_ID, ID),
	to: getPropValue(busOptionsLocal[CAMPUS_STOPS], MUNJI, NAME_ID, ID)
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case DATA_FETCH_SUCCESS:
			const database = action.payload[BUS_DATABASE];
			const specialHolidays = action.payload[SPECIAL_HOLIDAYS];
			return {
				...state,
				database: {
					busOptions: database[OPTIONS],
					timetableAll: database[TIMETABLE],
					travelTimes: database[TRAVEL_TIMES],
					specialHolidays: specialHolidays[DATES]
				}
			};
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
