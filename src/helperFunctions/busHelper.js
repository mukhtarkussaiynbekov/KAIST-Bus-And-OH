import {
	ID,
	NAME_ID,
	YESTERDAY,
	TODAY,
	TOMORROW,
	WEEKDAYS,
	WEEKENDS,
	HOLIDAYS,
	ROUTE,
	DEPARTURE_TIMES,
	TRAVEL_TIMES,
	STOP_ONE,
	STOP_TWO,
	INTERVAL,
	SAME_OPPOSITE_INTERVAL,
	NOTES,
	ANY
} from '../constants';
import {
	isHoliday,
	getHolidayTimes,
	getPropValue,
	getHoursMinutesSeconds,
	getDayMonth,
	isRegularDay
} from './commonFunctions';
import moment from 'moment-timezone';

export const getUpcomingTime = (state, busTypes, busStops, now, holidays) => {
	// returns departure time of upcoming bus

	let timetable = getTimetable(state, TODAY, busTypes, busStops, holidays);
	for (const [index, time] of timetable.entries()) {
		let timeLeft = getTimeLeftBus(time.leave, now, index);
		if (timeLeft >= 0) {
			return time;
		}
	}
};

export const getTimeLeftBus = (time, now, indexOfItem = 0) => {
	// returns time left in minutes
	// time and now are in format HH:mm
	// indexOfItem is some index of an item and is optional

	let [leaveTimeHours, leaveTimeMinutes] = getHoursMinutesSeconds(time);
	let [nowHours, nowMinutes] = getHoursMinutesSeconds(now);
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
	let closerToIndex = route.indexOf(to, fromIndex + 1);
	toIndex = closerToIndex;
	return [fromIndex, toIndex];
};

export const getTimeObjects = (listOfBusStops, from, to) => {
	// returns list of objects that have from and to in their [ROUTE] property
	// where from precedes to

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
	// returns time taken to travel between from and to

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
	// returns total time it takes to travel from first index stop
	// to last index stop

	let travelTime = 0;
	for (let i = 1; i < travelStops.length; i++) {
		let from = travelStops[i - 1];
		let to = travelStops[i];
		travelTime += getTimeInterval(from, to, travelTimeIntervals);
	}
	return travelTime;
};

export const getUniqueTimeValues = timetable => {
	// removes all duplicates that contain same value in leave property

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

export const getDayClassification = dayType => {
	// returns WEEKDAYS or WEEKENDS depending on dayType

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
	// adds midnight times of previous day to timetable
	// and returns newly created list

	let midnightTimes = [];
	for (let time of yesterdayTimetable) {
		// same assumption as in getTimeLeftBus function
		if (time.leave < '07') {
			midnightTimes.push(time);
		}
	}
	return [...midnightTimes, ...timetable];
};

export const getDepartureTimes = (
	object,
	dayType,
	holidays,
	travelTimes,
	fromIndex
) => {
	/*
    input parameters:
    1. object is of form {"route": [], "departureTimes": {"weekdays": [], "weekends": [], "holidays": {"hours": []}}}
    2. dayType is a string constant like TODAY, TOMORROW, YESTERDAY, etc.
    3. holidays is a list of dates like ["02-12", "03-25"]
    4. travelTimes is a list of objects like [
      {
        "stopOne": "munji",
        "stopTwo": "hwaam",
        "interval": 10,
        "sameOppositeInterval": true
      }
    ]
    5. fromIndex is an index of object[ROUTE] list

    output: departureTimes - list of moment instances that indicate departure times
  */

	let route = object[ROUTE];
	let travelStops = route.slice(0, fromIndex + 1);
	let travelTime = getTravelTime(travelStops, travelTimes);
	let departureTimesObject = object[DEPARTURE_TIMES];
	let dayClassification = getDayClassification(dayType);
	let initialDepartureTimes = departureTimesObject[dayClassification];
	if (isHoliday(dayType, holidays) && HOLIDAYS in departureTimesObject) {
		let holidayTimes = departureTimesObject[HOLIDAYS];
		let formattedDate = getDayMonth(dayType);
		if (!isRegularDay(holidayTimes, formattedDate)) {
			initialDepartureTimes = getHolidayTimes(
				departureTimesObject,
				holidayTimes,
				formattedDate
			);
		}
	}
	if (initialDepartureTimes === undefined) {
		return [];
	}
	let departureTimes = [];
	for (let time of initialDepartureTimes) {
		let leaveTime = moment(time, 'HH:mm').tz('Asia/Seoul');
		let currentLeaveTime = leaveTime.clone().add(travelTime, 'm');
		departureTimes.push(currentLeaveTime);
	}
	return departureTimes;
};

export const populateTimetable = (
	objects,
	dayType,
	holidays,
	from,
	to,
	travelTimes,
	timetable
) => {
	/*
    input parameters:
    1. objects is a list of objects of form {"route": [], "departureTimes": {"weekdays": [], "weekends": [], "holidays": {"hours": []}}}
    2. dayType is a string constant like TODAY, TOMORROW, YESTERDAY, etc.
    3. holidays is a list of dates like ["02-12", "03-25"]
    4. from is a string that denotes source bus stop
    5. to is a string that denotes destination bus stop
    6. travelTimes is a list of objects like [
      {
        "stopOne": "munji",
        "stopTwo": "hwaam",
        "interval": 10,
        "sameOppositeInterval": true
      }
    ]
    6. timetable is a list where we need to store the data

    output: no output, modify timetable inside the function
  */

	for (let object of objects) {
		let route = object[ROUTE];
		let [fromIndex, toIndex] = getFromToIndices(from, to, route);
		let travelStops = route.slice(fromIndex, toIndex + 1);
		let travelTime = getTravelTime(travelStops, travelTimes);
		let leaveTimes = getDepartureTimes(
			object,
			dayType,
			holidays,
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

export const getTimetable = (state, dayType, busTypes, busStops, holidays) => {
	/*
    input parameters:
    1. state is bus reducer's state.
    2. dayType is a string constant like TODAY, TOMORROW, YESTERDAY, etc.
    3. busTypes is a list of strings like ["campusStops", "olevStops"]
    4. busStops is a list of strings like [
      {"name": "Main Campus", "name_id": "main", "id": 0}
      ]
      that corresponds to bus type
    5. holidays is a list of dates like ["02-12", "03-25"]

    output: departureTimes - list of moment instances that indicate departure times
  */

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
	populateTimetable(
		objects,
		dayType,
		holidays,
		from,
		to,
		travelTimes,
		timetable
	);
	timetable = getUniqueTimeValues(timetable);
	if (dayType === TODAY) {
		let yesterdayTimetable = getTimetable(
			state,
			YESTERDAY,
			busTypes,
			busStops,
			holidays
		);
		timetable = addMidnightTimes(timetable, yesterdayTimetable);
	}
	return timetable;
};

export const getBusNote = (state, dayType, busTypes, busStops, holidays) => {
	/*
    input parameters:
    1. state is bus reducer's state.
    2. dayType is a string constant like TODAY, TOMORROW, YESTERDAY, etc.
    3. busTypes is a list of strings like ["campusStops", "olevStops"]
    4. busStops is a list of strings like [
      {"name": "Main Campus", "name_id": "main", "id": 0}
      ]
      that corresponds to bus type

    output: note - string that provides additional information about a route
  */

	let busType = getPropValue(busTypes, state.busType, ID, NAME_ID);
	const listOfBusStops = state.database.timetableAll[busType];
	let from = getPropValue(busStops, state.from, ID, NAME_ID);
	let to = getPropValue(busStops, state.to, ID, NAME_ID);
	if (from === to) {
		return '';
	}
	let objects = getTimeObjects(listOfBusStops, from, to);
	if (objects.length === 0) {
		return '';
	}
	for (let object of objects) {
		if (NOTES in object) {
			let notes = object[NOTES];
			let formattedDate = getDayMonth(dayType);
			if (formattedDate in notes) {
				return notes[formattedDate];
			}
			if (isHoliday(dayType, holidays) && HOLIDAYS in notes) {
				return notes[HOLIDAYS];
			}
			let dayClassification = getDayClassification(dayType);
			if (dayClassification in notes) {
				return notes[dayClassification];
			}
			if (ANY in notes) {
				return notes[ANY];
			}
		}
	}
	return '';
};
