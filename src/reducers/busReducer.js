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
	REMOVE_TIME,
	NAME_ID,
	ID
} from '../constants';
import { getPropValue, getTimetable } from './helperFunctions';

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
		items:
			busOptionsLocal[getPropValue(busOptionsLocal[BUS_TYPES], 2, ID, NAME_ID)], // campus stops
		from: 0, // main campus
		to: 1, // munji
		timetable: []
	}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case REMOVE_TIME:
			const timetable = state.busStops.timetable;
			const idx = timetable.indexOf(action.payload);
			let copyTimetable = [...timetable];
			copyTimetable.splice(idx, 1);
			return {
				...state,
				busStops: {
					...state.busStops,
					timetable: copyTimetable
				}
			};
		// case DATA_FETCH_SUCCESS:
		// 	return {
		// 		...newState
		// 		busStops: { ...newState.busStops, timetable: getTimetable(newState) }
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
			newState1.busStops.timetable = getTimetable(newState1);
			return newState1;
		case CHANGE_TYPE:
			const busStops =
				state.database.busOptions[
					getPropValue(state.busType.items, action.payload, ID, NAME_ID)
				];
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
			newState2.busStops.timetable = getTimetable(newState2);
			return newState2;
		case CHANGE_DAY:
			const newState3 = {
				...state,
				dayType: {
					...state.dayType,
					selected: action.payload
				}
			};
			newState3.busStops.timetable = getTimetable(newState3);
			return newState3;
		case CHANGE_FROM:
			const newState4 = {
				...state,
				busStops: {
					...state.busStops,
					from: action.payload
				}
			};
			newState4.busStops.timetable = getTimetable(newState4);
			return newState4;
		case CHANGE_TO:
			const newState5 = {
				...state,
				busStops: {
					...state.busStops,
					to: action.payload
				}
			};
			newState5.busStops.timetable = getTimetable(newState5);
			return newState5;
		default:
			return {
				...state,
				busStops: { ...state.busStops, timetable: getTimetable(state) }
			};
	}
};
