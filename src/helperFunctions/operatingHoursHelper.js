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
	INFINITY,
	CLOSED,
	ENGLISH,
	KOREAN
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
import 'moment/locale/ko';

export const getClassFacility = facility => {
	// returns classification and facility name
	// input format is "classification_facilityName"

	let loDashIdx = facility.indexOf('_');

	if (loDashIdx === -1) {
		return [facility, ''];
	}

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

	let formattedDate = getDayMonth(dayType, now);

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
	facilityID,
	listOfOperatingHours,
	dayType,
	facilities,
	holidays,
	now = moment().tz('Asia/Seoul')
) => {
	// returns a list of objects like [{start: '09:00', finish: '19:00'}]

	let facility = getPropValue(facilities, facilityID, ID, NAME_ID);
	let [classification, facilityName] = getClassFacility(facility);
	if (facilityName === '') {
		return [];
	}
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

export const getTimeLeftIsOpen = (
	facilityID,
	listOfOperatingHours,
	dayType,
	facilities,
	holidays,
	isKorean = false
) => {
	/*
    input parameters:
    1. facilityID is a facility's id inside options
    2. listOfOperatingHours is a database that is in the form of list that contains all facility infos.
    3. facilities is a list of objects that will be passed to
        getOperatingHoursList function.
    4. holidays is a list of dates like ["02-12", "03-25"]

    output: [timeLeft, isOpen, isYesterday, nextTime] - timeLeft: int, isOpen: boolean, isYesterday: boolean, nextTime: string
    timeLeft indicates time left until closing if isOpen = true.
    Otherwise if isOpen = false, timeLeft indicates time left until opening.
    isYesterday denotes whether yesterday opened facility still has not closed.
    nextTime is the time for which timeLeft shows remaining time.
  */

	if (dayType !== TODAY) {
		return [0, false];
	}

	let facility = getPropValue(facilities, facilityID, ID, NAME_ID);
	let [classification, facilityName] = getClassFacility(facility);
	if (facilityName === '') {
		return [0, false];
	}
	let operatingHoursObject = getOperatingHoursObject(
		classification,
		facilityName,
		listOfOperatingHours
	);

	if (!(HOURS in operatingHoursObject)) {
		return [INFINITY, false];
	}

	let now = moment().tz('Asia/Seoul');

	let todayHours = getOperatingHoursList(
		facilityID,
		listOfOperatingHours,
		dayType,
		facilities,
		holidays,
		now
	);

	let nowFormatted = now.format('HH:mm:ss');
	let formattedDate = now.format('MM-DD');
	// handle case when an office decides to close for some reasons other than holidays
	if (
		CLOSED in operatingHoursObject[HOURS] &&
		operatingHoursObject[HOURS][CLOSED].includes(formattedDate)
	) {
		todayHours = [];
	}

	if (todayHours.length === 0 || todayHours[0].start > nowFormatted) {
		const yesterdayHours = getOperatingHoursList(
			facilityID,
			listOfOperatingHours,
			YESTERDAY,
			facilities,
			holidays,
			now
		);
		if (yesterdayHours.length > 0) {
			let lastTime = yesterdayHours[yesterdayHours.length - 1];
			if (lastTime.finish < lastTime.start) {
				let timeLeftUntilClosing = getTimeLeftOH(lastTime.finish, nowFormatted);
				if (timeLeftUntilClosing > 0) {
					return [timeLeftUntilClosing, true, true, lastTime.finish];
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
			return [timeLeft, false, false, hour.start];
		} else if (hour.finish > nowFormatted) {
			timeLeft = getTimeLeftOH(hour.finish, nowFormatted);
			return [timeLeft, true, false, hour.finish];
		} else if (hour.finish < hour.start) {
			timeLeft = getTimeLeftOH(hour.finish, nowFormatted, true);
			return [timeLeft, true, false, hour.finish];
		}
	}

	now = now.clone();
	now.add(1, 'days');
	let dayHours = getOperatingHoursList(
		facilityID,
		listOfOperatingHours,
		TODAY,
		facilities,
		holidays,
		now
	);
	let foundProperTime = false;
	let additionalDays = 0;
	let openTime;
	while (!foundProperTime) {
		formattedDate = now.format('MM-DD');
		// handle case when an office decides to close for some reasons other than holidays
		if (
			CLOSED in operatingHoursObject[HOURS] &&
			operatingHoursObject[HOURS][CLOSED].includes(formattedDate)
		) {
			dayHours = [];
		}
		for (let hour of dayHours) {
			openTime = hour.start;
			timeLeft = getTimeLeftOH(openTime, nowFormatted);
			foundProperTime = true;
			break;
		}
		additionalDays += 1;
		if (!foundProperTime) {
			now.add(1, 'days');
			dayHours = getOperatingHoursList(
				facilityID,
				listOfOperatingHours,
				TODAY,
				facilities,
				holidays,
				now
			);
		}
	}
	timeLeft += additionalDays * 24 * 60 * 60;

	if (isKorean) {
		now.locale('ko');
	} else {
		now.locale('en');
	}

	let timeMessage = now.format(
		`${openTime}, dddd, MMMM D${isKorean ? '일' : ''}`
	);
	return [timeLeft, false, false, timeMessage];
};

export const getFacilityNote = (
	facilityID,
	listOfOperatingHours,
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
			facilityID,
			listOfOperatingHours,
			dayType,
			facilities,
			holidays
		);
		if (isYesterday) {
			return getFacilityNote(
				facilityID,
				listOfOperatingHours,
				YESTERDAY,
				facilities,
				holidays,
				now
			);
		}
	}

	let facility = getPropValue(facilities, facilityID, ID, NAME_ID);
	let [classification, facilityName] = getClassFacility(facility);
	if (facilityName === '') {
		return { [ENGLISH]: '', [KOREAN]: '' };
	}
	let operatingHoursObject = getOperatingHoursObject(
		classification,
		facilityName,
		listOfOperatingHours
	);
	if (NOTES in operatingHoursObject) {
		let notes = operatingHoursObject[NOTES];
		let formattedDate = getDayMonth(dayType, now);
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
