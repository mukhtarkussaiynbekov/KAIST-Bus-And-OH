// hooks
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// components
import { StyleSheet, FlatList } from 'react-native';
import Dropdown from '../components/Dropdown';
import OperatingHourCountDown from '../components/OperatingHourCountDown';
import Timetable from '../components/Timetable';
import TimetableCell from '../components/TimetableCell';

// helper functions and constants
import { getPropValue } from '../helperFunctions/commonFunctions';
import {
	getClassFacility,
	getOperatingHoursList
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
	ENGLISH,
	CHILDREN
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

	const facilityFullNameID = getPropValue(
		facilities,
		state.facility,
		ID,
		NAME_ID
	);

	const [classification, facilityNameID] = getClassFacility(facilityFullNameID);

	let displayOperatingHours = [];
	if (facilityNameID === '') {
		let children = getPropValue(facilities, classification, NAME_ID, CHILDREN);
		for (let child of children) {
			displayOperatingHours.push({ [ID]: child[ID], [NAME]: child[NAME] });
		}
	} else {
		let facilityName = getPropValue(facilities, state.facility, ID, NAME);
		displayOperatingHours = [{ [ID]: state.facility, [NAME]: facilityName }];
	}

	const listOfOperatingHours = state.database.operatingHours[OPERATING_HOURS];

	const operatingHours = getOperatingHoursList(
		state.facility,
		listOfOperatingHours,
		dayType,
		facilities,
		holidays
	);

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
			{dayType === TODAY ? (
				<FlatList
					data={displayOperatingHours}
					keyExtractor={facility => facility[ID].toString()}
					renderItem={({ item }) => {
						return (
							<OperatingHourCountDown
								state={state}
								language={language}
								facilityID={item[ID]}
								facilityName={item[NAME]}
								holidays={holidays}
								showCountDown={displayOperatingHours.length === 1}
							/>
						);
					}}
				/>
			) : (
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
			)}
		</>
	);
};

OperatingHoursScreen.navigationOptions = {
	title: 'Operating Hours'
};

const styles = StyleSheet.create({});

export default OperatingHoursScreen;
