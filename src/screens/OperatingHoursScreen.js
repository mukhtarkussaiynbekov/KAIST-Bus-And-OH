// hooks
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// components
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import OperatingHourCountDown from '../components/OperatingHourCountDown';
import Timetable from '../components/Timetable';
import TimetableCell from '../components/TimetableCell';

// helper functions and constants
import { getPropValue } from '../helperFunctions/commonFunctions';
import {
	getClassFacility,
	getFacilityNote,
	getOperatingHoursList,
	getTimeLeftIsOpen
} from '../helperFunctions/operatingHoursHelper';
import {
	OPERATING_HOURS,
	CHANGE_OH_DAY,
	CHANGE_FACILITY,
	DAY_TYPES,
	FACILITIES,
	ID,
	NAME,
	NAME_ID,
	TODAY,
	INFINITY,
	ENGLISH,
	KOREAN
} from '../constants';

const OperatingHoursScreen = () => {
	// get operating hour state and dispatch from the store
	const {
		operatingHours: state,
		holidays,
		language: languageState
	} = useSelector(storeState => storeState);
	const dispatch = useDispatch();

	// following declarations are needed to get facility info and
	// to render flat list as well as drop downs.
	const language = getPropValue(
		languageState.items,
		languageState.selected,
		ID,
		NAME_ID
	);
	const options = state.database.options[language];
	const dayTypes = options[DAY_TYPES];
	const dayType = getPropValue(dayTypes, state.dayType, ID, NAME_ID);
	const facilities = options[FACILITIES];
	const facility = getPropValue(facilities, state.facility, ID, NAME);
	const facilityNoteObject = getFacilityNote(
		state,
		dayType,
		facilities,
		holidays
	);
	const facilityNote =
		facilityNoteObject !== undefined ? facilityNoteObject[language] : '';

	const facilityFullNameID = getPropValue(
		facilities,
		state.facility,
		ID,
		NAME_ID
	);

	const [classification, facilityNameID] = getClassFacility(facilityFullNameID);

	const listOfOperatingHours = state.database.operatingHours[OPERATING_HOURS];

	const operatingHours = getOperatingHoursList(
		state.facility,
		listOfOperatingHours,
		dayType,
		facilities,
		holidays
	);
	const [
		initialTimeLeft,
		initialIsOpen,
		,
		inititalTimeMessage
	] = getTimeLeftIsOpen(
		state.facility,
		listOfOperatingHours,
		dayType,
		facilities,
		holidays,
		language == KOREAN
	);

	const [facilityInfo, setFacilityInfo] = useState({
		timeLeft: initialTimeLeft,
		isOpen: initialIsOpen,
		timeMessage: inititalTimeMessage
	});

	useEffect(() => {
		// update facility info whenever state changes
		const [newTimeLeft, newIsOpen, , newTimeMessage] = getTimeLeftIsOpen(
			state.facility,
			listOfOperatingHours,
			dayType,
			facilities,
			holidays,
			language == KOREAN
		);
		setFacilityInfo({
			timeLeft: newTimeLeft,
			isOpen: newIsOpen,
			timeMessage: newTimeMessage
		});
	}, [state]);

	return (
		<>
			<Dropdown
				title={language === ENGLISH ? 'Day' : '요일'}
				items={dayTypes}
				hideSearch={true}
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_OH_DAY, payload: selectedItem })
				}
				chosenItem={state.dayType}
			/>
			<Dropdown
				title={language === ENGLISH ? 'Facility' : '시설'}
				items={facilities}
				searchPlaceholderText={
					language === ENGLISH ? 'Search a facility' : '시설 검색'
				}
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_FACILITY, payload: selectedItem })
				}
				chosenItem={state.facility}
			/>
			{facilityNote !== '' && (
				<Text style={styles.note}>
					<Text style={styles.boldText}>
						{language === ENGLISH ? 'Note' : '참고'}:{' '}
					</Text>
					{facilityNote}
				</Text>
			)}
			{facilityNameID === '' ? (
				<Text>parent is selected</Text>
			) : dayType === TODAY ? (
				<View style={styles.countDown}>
					<OperatingHourCountDown
						facility={facility}
						isOpen={facilityInfo.isOpen}
						timeLeft={facilityInfo.timeLeft}
						timeMessage={facilityInfo.timeMessage}
						language={language}
						updateTimeLeft={() => {
							const [
								reevaluatedTimeLeft,
								reevaluatedIsOpen,
								,
								reevaluatedTimeMessage
							] = getTimeLeftIsOpen(
								state.facility,
								listOfOperatingHours,
								dayType,
								facilities,
								holidays,
								language == KOREAN
							);
							setFacilityInfo({
								timeLeft: reevaluatedTimeLeft,
								isOpen: reevaluatedIsOpen,
								timeMessage: reevaluatedTimeMessage
							});
						}}
					/>
				</View>
			) : (
				facilityInfo.timeLeft !== INFINITY && (
					<Timetable
						header={
							<TimetableCell
								columnTexts={
									language === ENGLISH
										? { first: 'Open At', second: 'Close At' }
										: { first: '여는 시각', second: '닫는 시각' }
								}
							/>
						}
						timetable={operatingHours}
						renderFunction={({ item }) => {
							return (
								<TimetableCell
									columnTexts={{ first: item.start, second: item.finish }}
								/>
							);
						}}
					/>
				)
			)}
		</>
	);
};

OperatingHoursScreen.navigationOptions = {
	title: 'Operating Hours'
};

const styles = StyleSheet.create({
	countDown: {
		marginTop: 40
	},
	note: {
		paddingHorizontal: 10,
		marginVertical: 10,
		fontSize: 16
	},
	boldText: {
		fontWeight: 'bold'
	}
});

export default OperatingHoursScreen;
