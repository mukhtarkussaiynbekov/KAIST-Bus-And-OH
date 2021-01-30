import {
	CHILDREN,
	ID,
	NAME_ID,
	TODAY,
	TOMORROW,
	WEEKDAYS,
	WEEKENDS,
	SPECIAL_HOLIDAY,
	ROUTE,
	DEPARTURE_TIMES,
	TRAVEL_TIMES,
	STOP_ONE,
	STOP_TWO,
	INTERVAL,
	SAME_OPPOSITE_INTERVAL
} from '../constants';
import moment from 'moment-timezone';

export const getTimeLeft = time => {
	// returns time left in seconds
	let leaveTime = moment.duration(time, 'HH:mm');
	let nowFormatted = moment().format('HH:mm:ss');
	let now = moment.duration(nowFormatted, 'HH:mm:ss');
	let timeLeft = leaveTime.asSeconds() - now.asSeconds();
	if (leaveTime.hours() < 4 && now.hours() > leaveTime.hours()) {
		timeLeft += 24 * 60 * 60;
	}
	return timeLeft;
};

export const getPropValue = (
	objectsList,
	propValue,
	propIdentifier,
	targetPropIdentifier
) => {
	for (let object of objectsList) {
		if (object[propIdentifier] === propValue) {
			return object[targetPropIdentifier];
		}
		if (CHILDREN in object) {
			for (let child of object[CHILDREN]) {
				if (child[propIdentifier] === propValue) {
					return child[targetPropIdentifier];
				}
			}
		}
	}
};

export const getDepartureTimes = (
	object,
	dayType,
	specialHolidays,
	travelTimes,
	fromIndex
) => {
	// TODO: handle case when it is midnight and there are still upcoming buses.
	let route = object[ROUTE];
	let travelStops = route.slice(0, fromIndex + 1);
	let travelTime = getTravelTime(travelStops, travelTimes);
	const departureTimesObject = object[DEPARTURE_TIMES];
	const dayClassification = getWeekdaysOrWeekends(dayType);
	let initialDepartureTimes = departureTimesObject[dayClassification];
	if (
		isSpeicalHoliday(dayType, specialHolidays) &&
		SPECIAL_HOLIDAY in object[DEPARTURE_TIMES]
	) {
		initialDepartureTimes = departureTimesObject[SPECIAL_HOLIDAY];
	}
	let departureTimes = [];
	for (let time of initialDepartureTimes) {
		let leaveTime = moment(time, 'HH:mm').tz('Asia/Seoul');
		let currentLeaveTime = leaveTime.clone().add(travelTime, 'm');
		departureTimes.push(currentLeaveTime);
	}
	return departureTimes;
};

export const getFromToIndices = (from, to, route) => {
	// returns indices of strings specified by from and to
	// in the route parameter
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

export const getTimeObjects = (listOfBusStops, from, to) => {
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

export const getTimeInterval = (from, to, travelTimeIntervals) => {
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

export const getTravelTime = (travelStops, travelTimeIntervals) => {
	let travelTime = 0;
	for (let i = 1; i < travelStops.length; i++) {
		let from = travelStops[i - 1];
		let to = travelStops[i];
		travelTime += getTimeInterval(from, to, travelTimeIntervals);
	}
	return travelTime;
};

export const getUniqueTimeValues = timetable => {
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

export const populateTimetable = (
	objects,
	dayType,
	specialHolidays,
	from,
	to,
	travelTimes,
	timetable
) => {
	for (let object of objects) {
		const [fromIndex, toIndex] = getFromToIndices(from, to, object[ROUTE]);
		let travelStops = object[ROUTE].slice(fromIndex, toIndex + 1);
		let travelTime = getTravelTime(travelStops, travelTimes);
		let leaveTimes = getDepartureTimes(
			object,
			dayType,
			specialHolidays,
			travelTimes,
			fromIndex
		);
		for (let leaveTime of leaveTimes) {
			let arriveTime = leaveTime.clone().add(travelTime, 'm');
			timetable.push({
				leave: leaveTime.format('HH:mm'),
				arrive: arriveTime.format('HH:mm')
			});
		}
	}
};

export const isSpeicalHoliday = (dateToCheck, specialHolidays) => {
	if (dateToCheck !== TODAY && dateToCheck !== TOMORROW) {
		return false;
	}

	let now = moment().tz('Asia/Seoul');
	if (dateToCheck === TOMORROW) {
		now.add(1, 'days');
	}

	let formattedDate = now.format('MM/DD');
	for (let date of specialHolidays) {
		if (date === formattedDate) {
			return true;
		}
	}
	return false;
};

export const getWeekdaysOrWeekends = dayType => {
	let now = moment().tz('Asia/Seoul');
	let day_of_week = now.format('E') - 1; // function returns value in range [1,7]
	switch (dayType) {
		case TODAY:
			return day_of_week <= 4 ? WEEKDAYS : WEEKENDS;
		case TOMORROW:
			day_of_week = (day_of_week + 1) % 7;
			return day_of_week <= 4 ? WEEKDAYS : WEEKENDS;
		default:
			return dayType;
	}
};

export const getTimetable = state => {
	let dayType = getPropValue(
		state.dayType.items,
		state.dayType.selected,
		ID,
		NAME_ID
	);
	let busType = getPropValue(
		state.busType.items,
		state.busType.selected,
		ID,
		NAME_ID
	);
	let listOfBusStops = state.database.timetableAll[busType];
	let from = getPropValue(
		state.busStops.items,
		state.busStops.from,
		ID,
		NAME_ID
	);
	let to = getPropValue(state.busStops.items, state.busStops.to, ID, NAME_ID);
	if (from === to) {
		return [];
	}
	const objects = getTimeObjects(listOfBusStops, from, to);
	if (objects.length === 0) {
		return [];
	}
	let timetable = [];
	populateTimetable(
		objects,
		dayType,
		state.database.specialHolidays.dates,
		from,
		to,
		state.database.travelTimes[TRAVEL_TIMES],
		timetable
	);
	return getUniqueTimeValues(timetable);
};

export const getUpcomingTime = state => {
	const timetable = getTimetable(state);
	for (let time of timetable) {
		if (getTimeLeft(time.leave) >= 0) {
			return time;
		}
	}
};
