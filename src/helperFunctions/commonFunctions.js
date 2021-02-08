import { CHILDREN, YESTERDAY, TODAY, TOMORROW, HOURS } from '../constants';
import moment from 'moment-timezone';

export const getDayMonth = dayType => {
	let now = moment().tz('Asia/Seoul');
	if (dayType === TOMORROW) {
		now.add(1, 'days');
	} else if (dayType === YESTERDAY) {
		now.subtract(1, 'days');
	}
	return now.format('MM/DD');
};

export const isSpecialHoliday = (dayType, specialHolidays) => {
	if (dayType !== YESTERDAY && dayType !== TODAY && dayType !== TOMORROW) {
		return false;
	}

	let formattedDate = getDayMonth(dayType);
	for (let date of specialHolidays) {
		if (date === formattedDate) {
			return true;
		}
	}
	return false;
};

export const getSpecialHolidayTimes = (timeObject, dayType) => {
	let formattedDate = getDayMonth(dayType);
	if (formattedDate in timeObject) {
		return timeObject[formattedDate];
	}
	return timeObject[HOURS];
};

export const getHoursAndMinutes = time => {
	let hours = parseInt(time.slice(0, 2));
	let minutes = parseInt(time.slice(3));
	return [hours, minutes];
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
