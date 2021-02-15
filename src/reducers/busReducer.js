import optionsEnglishLocal from '../json/busData/options/english.json';
import optionsKoreanLocal from '../json/busData/options/korean.json';
import busTimetableLocal from '../json/busData/busTimetable.json';
import busTravelTimesLocal from '../json/busData/busTravelTimes.json';
import {
	NAME_ID,
	ID,
	DAY_TYPES,
	TODAY,
	BUS_TYPES,
	CAMPUS_STOPS,
	MAIN_CAMPUS,
	MUNJI,
	BUS_DATABASE,
	TIMETABLE,
	TRAVEL_TIMES,
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
		options: {
			english: optionsEnglishLocal,
			korean: optionsKoreanLocal
		},
		timetableAll: busTimetableLocal,
		travelTimes: busTravelTimesLocal
	},
	busType: getPropValue(
		optionsKoreanLocal[BUS_TYPES],
		CAMPUS_STOPS,
		NAME_ID,
		ID
	),
	dayType: getPropValue(optionsKoreanLocal[DAY_TYPES], TODAY, NAME_ID, ID),
	from: getPropValue(
		optionsKoreanLocal[CAMPUS_STOPS],
		MAIN_CAMPUS,
		NAME_ID,
		ID
	),
	to: getPropValue(optionsKoreanLocal[CAMPUS_STOPS], MUNJI, NAME_ID, ID)
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case DATA_FETCH_SUCCESS:
			const database = action.payload[BUS_DATABASE];
			return {
				...state,
				database: {
					options: database[OPTIONS],
					timetableAll: database[TIMETABLE],
					travelTimes: database[TRAVEL_TIMES]
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
