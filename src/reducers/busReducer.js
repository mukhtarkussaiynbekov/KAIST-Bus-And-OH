import busOptionsLocal from '../json/busData/busOptions.json';
import busTimetableLocal from '../json/busData/busTimetable.json';
import busTravelTimesLocal from '../json/busData/busTravelTimes.json';
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
	NAME_ID,
	ID
} from '../constants';
import { getPropValue, getTimetable } from './helperFunctions';
import _ from 'lodash';

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
		// case DATA_FETCH_SUCCESS:
		// 	return {
		// 		...newState
		// 		busStops: { ...newState.busStops, timetable: getTimetable(newState) }
		// 	};
		case SWAP_STOPS:
			const newState1 = _.cloneDeep(state);
			const temp = newState1.busStops.from;
			newState1.busStops.from = newState1.busStops.to;
			newState1.busStops.to = temp;
			newState1.busStops.timetable = getTimetable(newState1);
			return newState1;
		case CHANGE_TYPE:
			const newState2 = _.cloneDeep(state);
			const busStops =
				newState2.database.busOptions[
					getPropValue(newState2.busType.items, action.payload, ID, NAME_ID)
				];
			newState2.busStops.items = busStops;
			newState2.busStops.from = 0;
			newState2.busStops.to = 1;
			newState2.busStops.timetable = getTimetable(newState2);
			return newState2;
		case CHANGE_DAY:
			const newState3 = _.cloneDeep(state);
			newState3.dayType.selected = action.payload;
			newState3.busStops.timetable = getTimetable(newState3);
			return newState3;
		case CHANGE_FROM:
			const newState4 = _.cloneDeep(state);
			newState4.busStops.from = action.payload;
			newState4.busStops.timetable = getTimetable(newState4);
			return newState4;
		case CHANGE_TO:
			const newState5 = _.cloneDeep(state);
			newState5.busStops.to = action.payload;
			newState5.busStops.timetable = getTimetable(newState5);
			return newState5;
		default:
			const newState6 = _.cloneDeep(state);
			newState6.busStops.timetable = getTimetable(newState6);
			return newState6;
	}
};
