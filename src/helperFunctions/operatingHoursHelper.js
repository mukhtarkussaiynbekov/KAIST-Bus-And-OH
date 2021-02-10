import {
	ID,
	NAME_ID,
	TODAY,
	TOMORROW,
	SPECIAL_HOLIDAY,
	OPERATING_HOURS,
	LOCATIONS,
	NAME,
	HOURS,
	dayNames,
	YESTERDAY,
	REGULAR
} from '../constants';
import {
	getPropValue,
	isSpecialHoliday,
	getSpecialHolidayTimes,
	getHoursMinutesSeconds,
	getDayMonth,
	isRegularDay
} from './commonFunctions';
import moment from 'moment-timezone';

export const getClassFacility = facility => {
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

export const getOperatingHours = (
	operatingHoursObject,
	dayType,
	specialHolidays,
	now = moment().tz('Asia/Seoul')
) => {
	if (
		isSpecialHoliday(dayType, specialHolidays, now) &&
		SPECIAL_HOLIDAY in operatingHoursObject
	) {
		let formattedDate = getDayMonth(dayType);
		if (!isRegularDay(operatingHoursObject[SPECIAL_HOLIDAY], formattedDate)) {
			return getSpecialHolidayTimes(operatingHoursObject, formattedDate);
		}
	}
	let dayIndex = convertDayToIndex(dayType);
	let day = dayNames[dayIndex];
	return operatingHoursObject[day];
};

export const convertDayToIndex = dayType => {
	let now = moment().tz('Asia/Seoul');
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

export const getOperatingHoursList = (
	state,
	dayType,
	facilities,
	now = moment().tz('Asia/Seoul')
) => {
	let facility = getPropValue(facilities, state.facility, ID, NAME_ID);
	const listOfOperatingHours = state.database.operatingHours[OPERATING_HOURS];
	let [classification, facilityName] = getClassFacility(facility);
	let operatingHoursObject = getOperatingHoursObject(
		classification,
		facilityName,
		listOfOperatingHours
	);
	const specialHolidays = state.database.specialHolidays.dates;
	let operatingHours = getOperatingHours(
		operatingHoursObject[HOURS],
		dayType,
		specialHolidays,
		now
	);
	return operatingHours;
};

export const getTimeLeftOH = (time, now, isNextDay = false) => {
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

export const getTimeLeftIsOpen = (state, dayType, todayHours, facilities) => {
	/*
    parameters:
    1. state is operatingHoursReducer's state
    2. todayHours is a list of objects where each object is of form
        {start: 'HH:mm', finish: 'HH:mm'}
    3. facilities is a list of objects that will be passed to
        getOperatingHoursList function.

    output: [timeLeft, isOpen] - timeLeft: int, isOpen: boolean
    timeLeft indicates time left until closing if isOpen = true.
    Otherwise if isOpen = false, timeLeft indicates time left until opening.
  */
	if (dayType !== TODAY) {
		return [0, false];
	}
	let now = moment().tz('Asia/Seoul');
	let nowFormatted = now.format('HH:mm:ss');
	if (todayHours.length === 0 || todayHours[0].start > nowFormatted) {
		const yesterdayHours = getOperatingHoursList(state, YESTERDAY, facilities);
		if (yesterdayHours.length > 0) {
			let lastTime = yesterdayHours[yesterdayHours.length - 1];
			let timeLeftUntilClosing = getTimeLeftOH(lastTime.finish, nowFormatted);
			if (timeLeftUntilClosing > 0) {
				return [timeLeftUntilClosing, true];
			}
		}
	}
	let foundProperTime = false;
	let timeLeft = 0;
	let isOpen = false;
	let dayHours = todayHours;
	let additionalDays = -1;
	while (!foundProperTime) {
		for (let hour of dayHours) {
			if (hour.start > nowFormatted) {
				timeLeft = getTimeLeftOH(hour.start, nowFormatted);
				foundProperTime = true;
				break;
			} else if (hour.finish > nowFormatted) {
				isOpen = true;
				timeLeft = getTimeLeftOH(hour.finish, nowFormatted);
				foundProperTime = true;
				break;
			} else if (hour.finish < hour.start) {
				isOpen = true;
				timeLeft = getTimeLeftOH(hour.finish, nowFormatted, true);
				foundProperTime = true;
				break;
			}
		}
		additionalDays += 1;
		if (!foundProperTime) {
			now.add(1, 'days');
			dayHours = getOperatingHoursList(state, TODAY, facilities, now);
		}
	}
	timeLeft += additionalDays * 24 * 60 * 60;
	return [timeLeft, isOpen];
};
