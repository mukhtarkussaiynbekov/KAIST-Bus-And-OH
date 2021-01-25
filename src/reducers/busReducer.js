import busOptionsLocal from '../json/busOptions.json';
import busTimetableLocal from '../json/busTimetable.json';
import {
	CHILDREN,
	ID,
	NAME_ID,
	BUS_TYPES,
	DAY_TYPES,
	SWAP_STOPS,
	CHANGE_TYPE,
	CHANGE_FROM,
	CHANGE_TO,
	CHANGE_DAY,
	DATA_FETCH_SUCCESS,
	REMOVE_TIME,
	TODAY,
	TOMORROW
} from '../constants';
import moment from 'moment-timezone';

const getObjectByID = (objectsList, id) => {
	for (let object of objectsList) {
		if (object[ID] === id) {
			return object;
		}
		if (CHILDREN in object) {
			for (let child of CHILDREN) {
				if (child[ID] === id) {
					return child;
				}
			}
		}
	}
};

const getNameID = (objectsList, id) => {
	const object = getObjectByID(objectsList, id);
	const nameID = object[NAME_ID];
	return nameID;
};

const getNameIDValue = (objectsContainer, nameID) => {
	return objectsContainer[nameID];
};

const getTimetable = state => {
	let dayType = getNameID(state.dayType.items, state.dayType.selected);
	if (dayType === TODAY || dayType == TOMORROW) {
		return [];
	}
	let busType = getNameID(state.busType.items, state.busType.selected);
	let listOfBusStops = getNameIDValue(state.timetableAll, busType);
	// console.log(departureTimes);
	// console.log(database['busTimetable']);
	let travelTime = 20;
	let timetable = [];
	for (let departTime of departureTimes) {
		let leaveTime = moment(departTime, 'HH:mm').tz('Asia/Seoul');
		let arriveTime = leaveTime.clone().add(travelTime, 'm');
		timetable.push({
			leave: leaveTime.format('HH:mm'),
			arrive: arriveTime.format('HH:mm')
		});
	}
	return timetable;
};

const INITIAL_STATE = {
	busOptions: busOptionsLocal,
	timetableAll: busTimetableLocal,
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
			return {
				...state,
				busStops: {
					...state.busStops,
					from: state.busStops.to,
					to: temp
					// timetable: getTimetable(
					// 	busOptions,
					// 	state.busType.items,
					// 	state.dayType.items
					// )
				}
			};
		case CHANGE_TYPE:
			const busStops = getNameIDValue(
				state.busOptions,
				getNameID(state.busType.items, action.payload)
			);
			return {
				...state,
				busType: {
					...state.busType,
					selected: action.payload
				},
				busStops: {
					...state.busStops,
					items: busStops
					// timetable: getTimetable(busOptions, busTypes, dayTypes)
				}
			};
		case CHANGE_DAY:
			return {
				...state,
				dayType: {
					...state.dayType,
					selected: action.payload
				}
				// timetable: getTimetable(busOptions, busTypes, dayTypes)
			};
		case CHANGE_FROM:
			return {
				...state,
				busStops: {
					...state.busStops,
					from: action.payload
				}
				// timetable: getTimetable(busOptions, busTypes, dayTypes)
			};
		case CHANGE_TO:
			return {
				...state,
				busStops: {
					...state.busStops,
					to: action.payload
				}
				// timetable: getTimetable(busOptions, busTypes, dayTypes)
			};
		default:
			return state;
	}
};
