import {
	ID,
	NAME_ID,
	TODAY,
	TOMORROW,
	HOLIDAYS,
	OPERATING_HOURS,
	LOCATIONS,
	NAME,
	HOURS,
	dayNames,
	YESTERDAY,
	NOTES,
	ANY,
	INFINITY
} from '../constants';
import {
	getPropValue,
	isHoliday,
	getHolidayTimes,
	getHoursMinutesSeconds,
	getDayMonth,
	isRegularDay
} from './commonFunctions';
import moment from 'moment-timezone';

export const getClassFacility = facility => {
	// returns classification and facility name
	// input format is "classification_facilityName"

	let loDashIdx = facility.indexOf('_');
	let classification = facility.slice(0, loDashIdx);
	let facilityName = facility.slice(loDashIdx + 1);
	return [classification, facilityName];
};

export const getOperatingHoursObject = (
	classification,
	facilityName,
	listOfOperatingHours
) => {
	// returns object that contains operating hours of facilityName

	for (let parent of listOfOperatingHours) {
		if (parent[NAME] !== classification) {
			continue;
		}
		for (let child of parent[LOCATIONS]) {
			if (child[NAME] === facilityName) {
				return child;
			}
		}
	}
};

export const convertDayToIndex = (dayType, now) => {
	// converts now (moment instance) to day index according to dayType

	let day_of_week = now.format('E') - 1; // function returns value in range [1,7]
	switch (dayType) {
		case YESTERDAY:
			day_of_week = day_of_week - 1 < 0 ? 6 : day_of_week - 1;
			return day_of_week;
		case TODAY:
			return day_of_week;
		case TOMORROW:
			day_of_week = (day_of_week + 1) % 7;
			return day_of_week;
		default:
			return dayNames.findIndex(day => day === dayType);
	}
};

export const getOperatingHours = (
	operatingHoursObject,
	dayType,
	holidays,
	now
) => {
	// returns a list of objects like [{start: '09:00', finish: '19:00'}]

	if (operatingHoursObject === undefined) {
		return [];
	}

	let formattedDate = getDayMonth(dayType);
	// if there is a key with particular date, that will take precedence over other keys
	if (formattedDate in operatingHoursObject) {
		return operatingHoursObject[formattedDate];
	}

	if (isHoliday(dayType, holidays, now) && HOLIDAYS in operatingHoursObject) {
		let holidayTimes = operatingHoursObject[HOLIDAYS];
		if (!isRegularDay(holidayTimes, formattedDate)) {
			return getHolidayTimes(operatingHoursObject, holidayTimes, formattedDate);
		}
	}
	let dayIndex = convertDayToIndex(dayType, now);
	let day = dayNames[dayIndex];
	return operatingHoursObject[day];
};

export const getOperatingHoursList = (
	state,
	dayType,
	facilities,
	holidays,
	now = moment().tz('Asia/Seoul')
) => {
	// returns a list of objects like [{start: '09:00', finish: '19:00'}]

	let facility = getPropValue(facilities, state.facility, ID, NAME_ID);
	const listOfOperatingHours = state.database.operatingHours[OPERATING_HOURS];
	let [classification, facilityName] = getClassFacility(facility);
	let operatingHoursObject = getOperatingHoursObject(
		classification,
		facilityName,
		listOfOperatingHours
	);
	let operatingHours = getOperatingHours(
		operatingHoursObject[HOURS],
		dayType,
		holidays,
		now
	);
	return operatingHours === undefined ? [] : operatingHours;
};

export const getTimeLeftOH = (time, now, isNextDay = false) => {
	// returns difference between time and now parameters

	let [timeHours, timeMinutes] = getHoursMinutesSeconds(time);
	let [nowHours, nowMinutes, nowSeconds] = getHoursMinutesSeconds(now);
	if (isNextDay) {
		timeHours += 24;
	}
	let timeLeft =
		60 * 60 * (timeHours - nowHours) +
		60 * (timeMinutes - nowMinutes) -
		nowSeconds;
	return timeLeft;
};

export const getTimeLeftIsOpen = (state, dayType, facilities, holidays) => {
	/*
    input parameters:
    1. state is operatingHoursReducer's state
    2. todayHours is a list of objects where each object is of form
        {start: 'HH:mm', finish: 'HH:mm'}
    3. facilities is a list of objects that will be passed to
        getOperatingHoursList function.
    4. holidays is a list of dates like ["02-12", "03-25"]

    output: [timeLeft, isOpen, isYesterday] - timeLeft: int, isOpen: boolean, isYesterday: boolean
    timeLeft indicates time left until closing if isOpen = true.
    Otherwise if isOpen = false, timeLeft indicates time left until opening.
    isYesterday denotes whether yesterday opened facility still has not closed
  */

	if (dayType !== TODAY) {
		return [0, false];
	}

	let facility = getPropValue(facilities, state.facility, ID, NAME_ID);
	const listOfOperatingHours = state.database.operatingHours[OPERATING_HOURS];
	let [classification, facilityName] = getClassFacility(facility);
	let operatingHoursObject = getOperatingHoursObject(
		classification,
		facilityName,
		listOfOperatingHours
	);

	const todayHours = getOperatingHoursList(
		state,
		dayType,
		facilities,
		holidays
	);

	if (!(HOURS in operatingHoursObject)) {
		return [INFINITY, false];
	}

	let now = moment().tz('Asia/Seoul');
	let nowFormatted = now.format('HH:mm:ss');
	if (todayHours.length === 0 || todayHours[0].start > nowFormatted) {
		const yesterdayHours = getOperatingHoursList(
			state,
			YESTERDAY,
			facilities,
			holidays
		);
		if (yesterdayHours.length > 0) {
			let lastTime = yesterdayHours[yesterdayHours.length - 1];
			if (lastTime.finish < lastTime.start) {
				let timeLeftUntilClosing = getTimeLeftOH(lastTime.finish, nowFormatted);
				if (timeLeftUntilClosing > 0) {
					return [timeLeftUntilClosing, true, true];
				}
			}
		}
	}

	let timeLeft = 0;
	for (let hour of todayHours) {
		if (hour.start === hour.finish) {
			return [INFINITY, true];
		}
		if (hour.start > nowFormatted) {
			timeLeft = getTimeLeftOH(hour.start, nowFormatted);
			return [timeLeft, false];
		} else if (hour.finish > nowFormatted) {
			timeLeft = getTimeLeftOH(hour.finish, nowFormatted);
			return [timeLeft, true];
		} else if (hour.finish < hour.start) {
			timeLeft = getTimeLeftOH(hour.finish, nowFormatted, true);
			return [timeLeft, true];
		}
	}

	now.add(1, 'days');
	let dayHours = getOperatingHoursList(state, TODAY, facilities, holidays, now);
	let foundProperTime = false;
	let additionalDays = 0;
	while (!foundProperTime) {
		for (let hour of dayHours) {
			timeLeft = getTimeLeftOH(hour.start, nowFormatted);
			foundProperTime = true;
			break;
		}
		additionalDays += 1;
		if (!foundProperTime) {
			now.add(1, 'days');
			dayHours = getOperatingHoursList(state, TODAY, facilities, holidays, now);
		}
	}
	timeLeft += additionalDays * 24 * 60 * 60;
	return [timeLeft, false];
};

export const getFacilityNote = (
	state,
	dayType,
	facilities,
	holidays,
	now = moment().tz('Asia/Seoul')
) => {
	/*
    returns note - string that provides additional information about a facility
  */

	if (dayType === TODAY) {
		let [, , isYesterday = false] = getTimeLeftIsOpen(
			state,
			dayType,
			facilities,
			holidays
		);
		if (isYesterday) {
			return getFacilityNote(state, YESTERDAY, facilities, holidays, now);
		}
	}

	let facility = getPropValue(facilities, state.facility, ID, NAME_ID);
	const listOfOperatingHours = state.database.operatingHours[OPERATING_HOURS];
	let [classification, facilityName] = getClassFacility(facility);
	let operatingHoursObject = getOperatingHoursObject(
		classification,
		facilityName,
		listOfOperatingHours
	);
	if (NOTES in operatingHoursObject) {
		let notes = operatingHoursObject[NOTES];
		let formattedDate = getDayMonth(dayType);
		// if there is a key with particular date, that will take precedence over other keys
		if (formattedDate in notes) {
			return notes[formattedDate];
		}
		if (isHoliday(dayType, holidays) && HOLIDAYS in notes) {
			return notes[HOLIDAYS];
		}
		let dayIndex = convertDayToIndex(dayType, now);
		let day = dayNames[dayIndex];
		if (day in notes) {
			return notes[day];
		}
		if (ANY in notes) {
			return notes[ANY];
		}
	}
};
