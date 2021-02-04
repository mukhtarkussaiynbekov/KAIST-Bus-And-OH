import {
	CHILDREN,
	ID,
	NAME_ID,
	YESTERDAY,
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
	SAME_OPPOSITE_INTERVAL,
	BUS_TYPES,
	DAY_TYPES
} from '../constants';
import moment from 'moment-timezone';

export const getHoursAndMinutes = time => {
	let hours = parseInt(time.slice(0, 2));
	let minutes = parseInt(time.slice(3));
	return [hours, minutes];
};

export const getTimeLeft = (time, indexOfItem = 0) => {
	// returns time left in minutes
	// time is in format HH:mm
	let [leaveTimeHours, leaveTimeMinutes] = getHoursAndMinutes(time);
	let now = moment().format('HH:mm');
	let [nowHours, nowMinutes] = getHoursAndMinutes(now);
	let timeLeft =
		leaveTimeHours * 60 + leaveTimeMinutes - (nowHours * 60 + nowMinutes);
	// below conditions with numbers 7 and 5 are hard coded.
	// currently, the last bus leaves after 3AM and
	// there is no bus at 4AM. You can reduce the
	// number, but then it will not handle future cases
	// where school decides to add additional bus times.
	if (leaveTimeHours < 7 && indexOfItem >= 5) {
		timeLeft += 24 * 60;
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
	let route = object[ROUTE];
	let travelStops = route.slice(0, fromIndex + 1);
	let travelTime = getTravelTime(travelStops, travelTimes);
	let departureTimesObject = object[DEPARTURE_TIMES];
	let dayClassification = getDayClassification(dayType);
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
		let [fromIndex, toIndex] = getFromToIndices(from, to, route);
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
		let [fromIndex, toIndex] = getFromToIndices(from, to, object[ROUTE]);
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
	if (dateToCheck === WEEKDAYS || dateToCheck === WEEKENDS) {
		return false;
	}

	let now = moment().tz('Asia/Seoul');
	if (dateToCheck === TOMORROW) {
		now.add(1, 'days');
	} else if (dateToCheck === YESTERDAY) {
		now.subtract(1, 'days');
	}

	let formattedDate = now.format('MM/DD');
	for (let date of specialHolidays) {
		if (date === formattedDate) {
			return true;
		}
	}
	return false;
};

export const getDayClassification = dayType => {
	let now = moment().tz('Asia/Seoul');
	let day_of_week = now.format('E') - 1; // function returns value in range [1,7]
	switch (dayType) {
		case YESTERDAY:
			day_of_week = day_of_week - 1 < 0 ? 6 : day_of_week - 1;
			break;
		case TODAY:
			break;
		case TOMORROW:
			day_of_week = (day_of_week + 1) % 7;
			break;
		default:
			return dayType;
	}
	return day_of_week <= 4 ? WEEKDAYS : WEEKENDS;
};

export const addMidnightTimes = (timetable, yesterdayTimetable) => {
	let midnightTimes = [];
	for (let time of yesterdayTimetable) {
		// same assumption as in getTimeLeft function
		if (time.leave < '07') {
			midnightTimes.push(time);
		}
	}
	return [...midnightTimes, ...timetable];
};

export const getTimetable = (state, dayType = undefined) => {
	const busOptions = state.database.busOptions;
	let dayTypes = busOptions[DAY_TYPES];
	if (dayType === undefined) {
		dayType = getPropValue(dayTypes, state.dayType, ID, NAME_ID);
	}
	let busTypes = busOptions[BUS_TYPES];
	let busType = getPropValue(busTypes, state.busType, ID, NAME_ID);
	let listOfBusStops = state.database.timetableAll[busType];
	let busStopsClassfication = getPropValue(
		busOptions[BUS_TYPES],
		state.busType,
		ID,
		NAME_ID
	);
	const busStops = busOptions[busStopsClassfication];
	let from = getPropValue(busStops, state.from, ID, NAME_ID);
	let to = getPropValue(busStops, state.to, ID, NAME_ID);
	if (from === to) {
		return [];
	}
	let objects = getTimeObjects(listOfBusStops, from, to);
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
	timetable = getUniqueTimeValues(timetable);
	if (dayType === TODAY) {
		let yesterdayTimetable = getTimetable(state, YESTERDAY);
		timetable = addMidnightTimes(timetable, yesterdayTimetable);
	}
	return timetable;
};

export const getUpcomingTime = state => {
	let timetable = getTimetable(state);
	for (const [index, time] of timetable.entries()) {
		let timeLeft = getTimeLeft(time.leave, index);
		if (timeLeft >= 0) {
			return time;
		}
	}
};

// Operating Hours helper functions

export const getTimeLeftOH = time => {
	// returns time left in seconds
	let leaveTime = moment.duration(time, 'HH:mm');
	let nowFormatted = moment().format('HH:mm:ss');
	let now = moment.duration(nowFormatted, 'HH:mm:ss');
	let timeLeft = leaveTime.asSeconds() - now.asSeconds();
	// below conditions with numbers 7 and 5 are hard coded.
	// currently, the last bus leaves after 3AM and
	// there is no bus at 4AM. You can reduce the
	// number, but then it will not handle future cases
	// where school decides to add additional bus times.
	if (leaveTime.hours() < 7) {
		timeLeft += 24 * 60 * 60;
	}
	return timeLeft;
};
