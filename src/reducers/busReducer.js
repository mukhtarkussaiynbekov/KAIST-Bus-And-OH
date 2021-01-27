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
			for (let child of object[CHILDREN]) {
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

const getDepartureTimes = (object, dayType, travelTimes, fromIndex) => {
	let route = object[ROUTE];
	let travelStops = route.slice(0, fromIndex + 1);
	let travelTime = getTravelTime(travelStops, travelTimes);
	let initialDepartureTimes = object[DEPARTURE_TIMES][dayType];
	let departureTimes = [];
	for (let time of initialDepartureTimes) {
		let leaveTime = moment(time, 'HH:mm').tz('Asia/Seoul');
		let currentLeaveTime = leaveTime.clone().add(travelTime, 'm');
		departureTimes.push(currentLeaveTime);
	}
	return departureTimes;
};

const getFromToIndices = (from, to, route) => {
	let toIndex = -1;
	let fromIndex = -1;
	for (let i = route.length - 1; i > 0; i--) {
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
	for (let item of listOfBusStops) {
		let route = item[ROUTE];
		const [fromIndex, toIndex] = getFromToIndices(from, to, route);
		if (fromIndex > -1 && toIndex > -1) {
			objects.push(item);
		}
	}
	return objects;
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

const getUniqueTimeValues = timetable => {
	let uniqueValues = [];
	let seen = {};
	for (let item of timetable) {
		if (!(item.leave in seen)) {
			seen[item.leave] = true;
			uniqueValues.push(item);
		}
	}
	return uniqueValues;
};

const populateTimetable = (
	objects,
	dayType,
	from,
	to,
	travelTimes,
	timetable
) => {
	for (let object of objects) {
		const [fromIndex, toIndex] = getFromToIndices(from, to, object[ROUTE]);
		let travelStops = object[ROUTE].slice(fromIndex, toIndex + 1);
		let travelTime = getTravelTime(travelStops, travelTimes);
		let leaveTimes = getDepartureTimes(object, dayType, travelTimes, fromIndex);
		for (let leaveTime of leaveTimes) {
			let arriveTime = leaveTime.clone().add(travelTime, 'm');
			timetable.push({
				leave: leaveTime.format('HH:mm'),
				arrive: arriveTime.format('HH:mm')
			});
		}
	}
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
	if (from === to) {
		return [];
	}
	const objects = getObjects(listOfBusStops, from, to);
	if (objects.length === 0) {
		return [];
	}
	let timetable = [];
	populateTimetable(
		objects,
		dayType,
		from,
		to,
		state.database.travelTimes[TRAVEL_TIMES],
		timetable
	);
	return getUniqueTimeValues(timetable);
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
				state.busOptions,
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
