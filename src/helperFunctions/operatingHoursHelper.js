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
	dayNames
} from '../constants';
import moment from 'moment-timezone';
import {
	getPropValue,
	isSpecialHoliday,
	getSpecialHolidayTimes
} from './commonFunctions';

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
	specialHolidays
) => {
	if (
		isSpecialHoliday(dayType, specialHolidays) &&
		SPECIAL_HOLIDAY in operatingHoursObject
	) {
		return getSpecialHolidayTimes(
			operatingHoursObject[SPECIAL_HOLIDAY],
			dayType,
			specialHolidays
		);
	}
	let dayIndex = convertDayToIndex(dayType);
	let day = dayNames[dayIndex];
	return operatingHoursObject[day];
};

export const convertDayToIndex = dayType => {
	let now = moment().tz('Asia/Seoul');
	let day_of_week = now.format('E') - 1; // function returns value in range [1,7]
	switch (dayType) {
		case TODAY:
			return day_of_week;
		case TOMORROW:
			day_of_week = (day_of_week + 1) % 7;
			return day_of_week;
		default:
			return dayNames.findIndex(day => day === dayType);
	}
};

export const getTimeLeftAndIsOpen = (state, dayType, facilities) => {
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
		specialHolidays
	);
	return operatingHours;
};
