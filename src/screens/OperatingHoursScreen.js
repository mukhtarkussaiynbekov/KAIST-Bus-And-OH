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
	TODAY
} from '../constants';

const OperatingHoursScreen = () => {
	// get operating hour state and dispatch from the store
	const state = useSelector(storeState => storeState.operatingHours);
	const dispatch = useDispatch();

	// following declarations are needed to get facility info and
	// to render flat list as well as drop downs.
	const options = state.database.options;
	const dayTypes = options[DAY_TYPES];
	const facilities = options[FACILITIES];
	const facilityName = getPropValue(facilities, state.facility, ID, NAME);
	const dayType = getPropValue(dayTypes, state.dayType, ID, NAME_ID);
	const operatingHours = getOperatingHoursList(state, dayType, facilities);
	const [initialTimeLeft, initialIsOpen] = getTimeLeftIsOpen(
		state,
		dayType,
		operatingHours,
		facilities
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
			operatingHours,
			facilities
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
							] = getTimeLeftIsOpen(state, dayType, operatingHours, facilities);
							setFacilityInfo({
								timeLeft: reevaluatedTimeLeft,
								isOpen: reevaluatedIsOpen
							});
						}}
					/>
				</View>
			) : (
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
			)}
		</>
	);
};

OperatingHoursScreen.navigationOptions = {
	title: 'Operating Hours'
};

const styles = StyleSheet.create({
	countDown: {
		marginTop: 80
	}
});

export default OperatingHoursScreen;
