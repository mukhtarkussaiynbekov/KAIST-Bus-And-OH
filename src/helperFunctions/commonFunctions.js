import {
	CHILDREN,
	YESTERDAY,
	TODAY,
	TOMORROW,
	HOURS,
	CLOSED,
	WEEKDAYS,
	WEEKENDS,
	MONDAY,
	TUESDAY,
	WEDNESDAY,
	THURSDAY,
	FRIDAY,
	SATURDAY,
	SUNDAY,
	REGULAR
} from '../constants';
import moment from 'moment-timezone';

export const getPropValue = (
	objectsList,
	propValue,
	propIdentifier,
	targetPropIdentifier
) => {
	/*
    input parameters:
    1. objectsList is a list of objects that will contain propIdentifier and targetPropIdentifier
    2. propValue is a value that corresponds to propIdentifier
    3. propIdentifier is a string that corresponds to some property
    4. targetPropIdentifier is a string that corresponds to some property

    output: value corresponding to targetPropIdentifier
  */

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

export const getDayMonth = (dayType, now = moment().tz('Asia/Seoul')) => {
	// returns string in format 'MM/DD'

	if (dayType === TOMORROW) {
		now.add(1, 'days');
	} else if (dayType === YESTERDAY) {
		now.subtract(1, 'days');
	}
	return now.format('MM-DD');
};

export const isSpecialHoliday = (
	dayType,
	specialHolidays,
	now = moment().tz('Asia/Seoul')
) => {
	// returns whether day provided by now parameter is a special holiday according to dayType.

	if (dayType !== YESTERDAY && dayType !== TODAY && dayType !== TOMORROW) {
		return false;
	}

	let formattedDate = getDayMonth(dayType, now);
	for (let date of specialHolidays) {
		if (date === formattedDate) {
			return true;
		}
	}
	return false;
};

export const isRegularDay = (timeObject, date) => {
	// returns whether REGULAR property is in timeObject or in date property inside timeObject.

	if (REGULAR in timeObject) {
		return true;
	}
	if (date in timeObject) {
		if (REGULAR in timeObject[date]) {
			return true;
		}
	}
};

export const getPropertyTime = (timeObject, specificDateObject) => {
	// returns time according to property inside specificDateObject.
	// timeObject is outer object that contains specificDateObject.

	if (CLOSED in specificDateObject) {
		return [];
	} else if (WEEKDAYS in specificDateObject) {
		return timeObject[WEEKDAYS];
	} else if (WEEKENDS in specificDateObject) {
		return timeObject[WEEKENDS];
	} else if (MONDAY in specificDateObject) {
		return timeObject[MONDAY];
	} else if (TUESDAY in specificDateObject) {
		return timeObject[TUESDAY];
	} else if (WEDNESDAY in specificDateObject) {
		return timeObject[WEDNESDAY];
	} else if (THURSDAY in specificDateObject) {
		return timeObject[THURSDAY];
	} else if (FRIDAY in specificDateObject) {
		return timeObject[FRIDAY];
	} else if (SATURDAY in specificDateObject) {
		return timeObject[SATURDAY];
	} else if (SUNDAY in specificDateObject) {
		return timeObject[SUNDAY];
	}
	return specificDateObject[HOURS];
};

export const getSpecialHolidayTimes = (timeObject, holidayTimes, date) => {
	// returns special holiday times according to date

	if (date in holidayTimes) {
		let specificDateObject = holidayTimes[date];
		return getPropertyTime(timeObject, specificDateObject);
	}
	return getPropertyTime(timeObject, holidayTimes);
};

export const getHoursMinutesSeconds = time => {
	// time in format 'HH:mm:ss'
	// return corresponding times

	let hours = parseInt(time.slice(0, 2));
	let minutes = parseInt(time.slice(3, 5));
	let seconds = parseInt(time.slice(6));
	return [hours, minutes, seconds];
};
