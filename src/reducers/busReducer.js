import busOptionsLocal from '../json/busOptions.json';
import busTimetableLocal from '../json/busTimetable.json';
import busTravelTimesLocal from '../json/busTravelTimes.json';
import specialHolidaysLocal from '../json/specialHolidays.json';
import {
	BUS_TYPES,
	DAY_TYPES,
	SWAP_STOPS,
	CHANGE_TYPE,
	CHANGE_FROM,
	CHANGE_TO,
	CHANGE_DAY,
	DATA_FETCH_SUCCESS,
	REMOVE_TIME
} from '../constants';
import { getNameID, getNameIDValue, getTimetable } from './helperFunctions';

const INITIAL_STATE = {
	database: {
		busOptions: busOptionsLocal,
		timetableAll: busTimetableLocal,
		travelTimes: busTravelTimesLocal,
		specialHolidays: specialHolidaysLocal
	},
	busType: {
		selected: 2, // campuses
		items: busOptionsLocal[BUS_TYPES]
	},
	dayType: {
		selected: 0, // today
		items: busOptionsLocal[DAY_TYPES]
	},
	busStops: {
		items: getNameIDValue(
			busOptionsLocal,
			getNameID(busOptionsLocal[BUS_TYPES], 2)
		), // campus stops
		from: 0, // main campus
		to: 1, // munji
		timetable: []
	}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case REMOVE_TIME:
			return {
				...state,
				busStops: {
					...state.busStops,
					timetable: state.busStops.timetable.filter(
						time => time !== action.payload
					)
				}
			};
		// case DATA_FETCH_SUCCESS:
		// 	return {
		// 		...state
		// 		// timetable: getTimetable(busOptions, busTypes, dayTypes, action.payload)
		// 	};
		case SWAP_STOPS:
			const temp = state.busStops.from;
			const newState1 = {
				...state,
				busStops: {
					...state.busStops,
					from: state.busStops.to,
					to: temp
				}
			};
			return {
				...newState1,
				busStops: {
					...newState1.busStops,
					timetable: getTimetable(newState1)
				}
			};
		case CHANGE_TYPE:
			const busStops = getNameIDValue(
				state.database.busOptions,
				getNameID(state.busType.items, action.payload)
			);
			const newState2 = {
				...state,
				busType: {
					...state.busType,
					selected: action.payload
				},
				busStops: {
					...state.busStops,
					items: busStops,
					from: 0,
					to: 1
				}
			};
			return {
				...newState2,
				busStops: { ...newState2.busStops, timetable: getTimetable(newState2) }
			};
		case CHANGE_DAY:
			const newState3 = {
				...state,
				dayType: {
					...state.dayType,
					selected: action.payload
				}
			};
			return {
				...newState3,
				busStops: { ...newState3.busStops, timetable: getTimetable(newState3) }
			};
		case CHANGE_FROM:
			const newState4 = {
				...state,
				busStops: {
					...state.busStops,
					from: action.payload
				}
			};
			return {
				...newState4,
				busStops: { ...newState4.busStops, timetable: getTimetable(newState4) }
			};
		case CHANGE_TO:
			const newState5 = {
				...state,
				busStops: {
					...state.busStops,
					to: action.payload
				}
			};
			return {
				...newState5,
				busStops: { ...newState5.busStops, timetable: getTimetable(newState5) }
			};
		default:
			return {
				...state,
				busStops: { ...state.busStops, timetable: getTimetable(state) }
			};
	}
};
