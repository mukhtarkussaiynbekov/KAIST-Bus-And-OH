import {
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
	SAME_OPPOSITE_INTERVAL
} from '../constants';
import {
	isSpecialHoliday,
	getSpecialHolidayTimes,
	getHoursAndMinutes,
	getPropValue
} from './commonFunctions';
import moment from 'moment-timezone';

export const getTimeLeft = (time, now, indexOfItem = 0) => {
	// returns time left in minutes
	// time is in format HH:mm
	let [leaveTimeHours, leaveTimeMinutes] = getHoursAndMinutes(time);
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
		isSpecialHoliday(dayType, specialHolidays) &&
		SPECIAL_HOLIDAY in departureTimesObject
	) {
		initialDepartureTimes = getSpecialHolidayTimes(
			departureTimesObject[SPECIAL_HOLIDAY],
			dayType
		);
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

export const getTimetable = (state, dayType, busTypes, busStops) => {
	let busType = getPropValue(busTypes, state.busType, ID, NAME_ID);
	const listOfBusStops = state.database.timetableAll[busType];
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
	const travelTimes = state.database.travelTimes[TRAVEL_TIMES];
	const specialHolidays = state.database.specialHolidays.dates;
	populateTimetable(
		objects,
		dayType,
		specialHolidays,
		from,
		to,
		travelTimes,
		timetable
	);
	timetable = getUniqueTimeValues(timetable);
	if (dayType === TODAY) {
		let yesterdayTimetable = getTimetable(state, YESTERDAY, busTypes, busStops);
		timetable = addMidnightTimes(timetable, yesterdayTimetable);
	}
	return timetable;
};

export const getUpcomingTime = (state, busTypes, busStops, now) => {
	let timetable = getTimetable(state, TODAY, busTypes, busStops);
	for (const [index, time] of timetable.entries()) {
		let timeLeft = getTimeLeft(time.leave, now, index);
		if (timeLeft >= 0) {
			return time;
		}
	}
};
