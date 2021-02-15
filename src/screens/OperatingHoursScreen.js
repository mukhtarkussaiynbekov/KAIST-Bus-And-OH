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
	getFacilityNote,
	getOperatingHoursList,
	getTimeLeftIsOpen
} from '../helperFunctions/operatingHoursHelper';
import {
	CHANGE_OH_DAY,
	CHANGE_FACILITY,
	DAY_TYPES,
	FACILITIES,
	ID,
	NAME,
	NAME_ID,
	TODAY,
	INFINITY
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
	const facilityName = getPropValue(facilities, state.facility, ID, NAME);
	const facilityNoteObject = getFacilityNote(
		state,
		dayType,
		facilities,
		holidays
	);
	const facilityNote =
		facilityNoteObject !== undefined ? facilityNoteObject[language] : '';

	const operatingHours = getOperatingHoursList(
		state,
		dayType,
		facilities,
		holidays
	);
	const [initialTimeLeft, initialIsOpen] = getTimeLeftIsOpen(
		state,
		dayType,
		facilities,
		holidays
	);

	const [facilityInfo, setFacilityInfo] = useState({
		timeLeft: initialTimeLeft,
		isOpen: initialIsOpen
	});

	useEffect(() => {
		// update facility info whenever state changes
		const [newTimeLeft, newIsOpen] = getTimeLeftIsOpen(
			state,
			dayType,
			facilities,
			holidays
		);
		setFacilityInfo({ timeLeft: newTimeLeft, isOpen: newIsOpen });
	}, [state]);

	return (
		<>
			<Dropdown
				title="Day"
				items={dayTypes}
				hideSearch={true}
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_OH_DAY, payload: selectedItem })
				}
				chosenItem={state.dayType}
			/>
			<Dropdown
				title="Facility"
				items={facilities}
				searchPlaceholderText="Search a facility"
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_FACILITY, payload: selectedItem })
				}
				chosenItem={state.facility}
				readOnlyHeadings
			/>
			{facilityNote !== '' && (
				<Text style={styles.note}>
					<Text style={styles.boldText}>Note: </Text>
					{facilityNote}
				</Text>
			)}
			{dayType === TODAY ? (
				<View style={styles.countDown}>
					<OperatingHourCountDown
						facilityName={facilityName}
						isOpen={facilityInfo.isOpen}
						timeLeft={facilityInfo.timeLeft}
						updateTimeLeft={() => {
							const [
								reevaluatedTimeLeft,
								reevaluatedIsOpen
							] = getTimeLeftIsOpen(state, dayType, facilities, holidays);
							setFacilityInfo({
								timeLeft: reevaluatedTimeLeft,
								isOpen: reevaluatedIsOpen
							});
						}}
					/>
				</View>
			) : (
				facilityInfo.timeLeft !== INFINITY && (
					<Timetable
						header={
							<TimetableCell
								columnTexts={{ first: 'Open At', second: 'Close At' }}
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
