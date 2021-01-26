import busOptionsLocal from '../json/busOptions.json';
import busTimetableLocal from '../json/busTimetable.json';
import busTravelTimesLocal from '../json/busTravelTimes.json';
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
	TOMORROW,
	WEEKDAYS,
	WEEKENDS,
	ROUTE,
	DEPARTURE_TIMES,
	TRAVEL_TIMES,
	STOP_ONE,
	STOP_TWO,
	INTERVAL,
	SAME_OPPOSITE_INTERVAL
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

const mergeSortedArrays = (array1, array2) => {
	let result = [];
	let i = 0;
	let j = 0;
	while (i < array1.length || j < array2.length) {
		if (i < array1.length && (j == array2.length || array1[i] < array2[j])) {
			result.push(array1[i]);
			i++;
		} else {
			result.push(array2[j]);
			j++;
		}
	}
	return result;
};

const getDepartureTimes = (objects, dayType, from, to) => {
	let mergedList = [];
	for (let item of objects) {
		const [fromIndex, _] = getFromToIndices(from, to, item);
		let travelStops = item[ROUTE].slice(0, fromIndex);
		let travelTime = getTravelTime(
			travelStops,
			state.database.travelTimes[TRAVEL_TIMES]
		);
		let initialDepartureTimes = item[DEPARTURE_TIMES][dayType];
		let currentDepartureTimes = [];
		for (let time of initialDepartureTimes) {
			let leaveTime = moment(time, 'HH:mm').tz('Asia/Seoul');
			let currentLeaveTime = leaveTime.clone().add(travelTime, 'm');
			currentDepartureTimes.push(currentLeaveTime);
		}
		mergedList = mergeSortedArrays(mergedList, currentDepartureTimes);
	}
	return mergedList;
};

const getFromToIndices = (from, to, item) => {
	let toIndex = -1;
	let fromIndex = -1;
	let route = item[ROUTE];
	for (let i = route.length; i > 0; i--) {
		if (route[i] === to) {
			toIndex = i;
			break;
		}
	}
	for (let j = toIndex - 1; j >= 0; j--) {
		if (route[j] === from) {
			fromIndex = j;
			break;
		}
	}
	return [fromIndex, toIndex];
};

const getObjects = (listOfBusStops, from, to) => {
	let objects = [];
	let travelStops = undefined;
	for (let item of listOfBusStops) {
		const [fromIndex, toIndex] = getFromToIndices(from, to, item);
		if (fromIndex > -1 && toIndex > -1) {
			objects.push(item);
			if (travelStops === undefined) {
				travelStops = route.slice(fromIndex, toIndex + 1);
			}
		}
	}
	return [objects, travelStops];
};

const getTimeInterval = (from, to, travelTimeIntervals) => {
	for (let item of travelTimeIntervals) {
		if (item[STOP_ONE] === from && item[STOP_TWO] === to) {
			return item[INTERVAL];
		}
		if (item[SAME_OPPOSITE_INTERVAL]) {
			if (item[STOP_TWO] === from && item[STOP_ONE] === to) {
				return item[INTERVAL];
			}
		}
	}
};

const getTravelTime = (travelStops, travelTimeIntervals) => {
	let travelTime = 0;
	for (let i = 1; i < travelStops.length; i++) {
		let from = travelStops[i - 1];
		let to = travelStops[i];
		travelTime += getTimeInterval(from, to, travelTimeIntervals);
	}
	return travelTime;
};

const getTimetable = state => {
	let dayType = getNameID(state.dayType.items, state.dayType.selected);
	if (dayType === TODAY || dayType == TOMORROW) {
		return [];
	}
	let busType = getNameID(state.busType.items, state.busType.selected);
	let listOfBusStops = getNameIDValue(state.database.timetableAll, busType);
	let from = getNameID(state.busStops.items, state.busStops.from);
	let to = getNameID(state.busStops.items, state.busStops.to);
	const [objects, travelStops] = getObjects(listOfBusStops, from, to);
	if (objects.length === 0) {
		return [];
	}
	let travelTime = getTravelTime(
		travelStops,
		state.database.travelTimes[TRAVEL_TIMES]
	);
	let timetable = [];
	let departureTimes = getDepartureTimes(objects, dayType, from, to);
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
	database: {
		busOptions: busOptionsLocal,
		timetableAll: busTimetableLocal,
		travelTimes: busTravelTimesLocal
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
			return {
				...state,
				busStops: { ...state.busStops, timetable: getTimetable(state) }
			};
	}
};
