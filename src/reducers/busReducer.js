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

const busTypes = busOptions[BUS_TYPES];
const dayTypes = busOptions[DAY_TYPES];

const getBusStops = (busOptions, busTypes, typeIndex) => {
	const busType = busTypes[typeIndex];
	const busStopsIdentifier = busType[BUS_STOPS_REFERENCE];
	return busOptions[busStopsIdentifier];
};

const getTimetable = (busOptions, busTypes, dayTypes, database) => {
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

const initialState = {
	type: 2, // campuses
	day: 0, // today
	from: 0, // main campus
	to: 5, // munji
	busStops: getBusStops(busOptions, busTypes, 2), // campus stops
	database: {},
	timetable: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case REMOVE_TIME:
			return {
				...state,
				timetable: state.timetable.filter(time => time !== action.payload)
			};
		case DATA_FETCH_SUCCESS:
			return {
				...state,
				database: action.payload,
				timetable: getTimetable(busOptions, busTypes, dayTypes, action.payload)
			};
		case SWAP_STOPS:
			const temp = state.from;
			return {
				...state,
				from: state.to,
				to: temp,
				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
			};
		case CHANGE_TYPE:
			const busStops = getBusStops(busOptions, busTypes, action.payload);
			return {
				...state,
				type: action.payload,
				busStops: busStops,
				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
			};
		case CHANGE_DAY:
			return {
				...state,
				day: action.payload,
				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
			};
		case CHANGE_FROM:
			return {
				...state,
				from: action.payload,
				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
			};
		case CHANGE_TO:
			return {
				...state,
				to: action.payload,
				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
			};
		default:
			return state;
	}
};
