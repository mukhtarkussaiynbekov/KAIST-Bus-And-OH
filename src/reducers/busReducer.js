import busOptions from '../json/busOptions.json';
import {
	BUS_STOPS_REFERENCE,
	BUS_TYPES,
	DAY_TYPES,
	BUS_STOP_CONNECTIONS,
	SWAP_STOPS,
	CHANGE_TYPE,
	CHANGE_FROM,
	CHANGE_TO,
	CHANGE_DAY,
	DATA_FETCH_SUCCESS,
	REMOVE_TIME
} from '../constants';
import moment from 'moment-timezone';

const getBusStops = (busOptions, busTypes, typeIndex) => {
	const busType = busTypes[typeIndex];
	const busStopsIdentifier = busType[BUS_STOPS_REFERENCE];
	return busOptions[busStopsIdentifier];
};

const getTimetable = state => {
	let departureTimes =
		database.busTimetable.campuses.munjiMain.departureTimes.weekends;
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
	busType: {
		selected: 2, // campuses
		items: busOptions[BUS_TYPES]
	},
	dayType: {
		selected: 0, // today
		items: busOptions[DAY_TYPES]
	},
	busStops: {
		items: getBusStops(busOptions, busOptions[BUS_TYPES], 2), // campus stops
		from: 0, // main campus
		to: 5, // munji
		timetable: ['08:00']
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
					from: state.to,
					to: temp
					// timetable: getTimetable(
					// 	busOptions,
					// 	state.busType.items,
					// 	state.dayType.items
					// )
				}
			};
		case CHANGE_TYPE:
			const busStops = getBusStops(
				busOptions,
				state.busType.items,
				action.payload
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
