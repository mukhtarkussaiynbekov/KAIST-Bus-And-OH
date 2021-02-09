import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeProvider, Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '../components/Dropdown';
import CountDown from 'react-native-countdown-component';
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
	NAME_ID
} from '../constants';

const OperatingHoursScreen = () => {
	const state = useSelector(storeState => storeState.operatingHours);
	const dispatch = useDispatch();

	const options = state.database.options;
	const dayTypes = options[DAY_TYPES];
	const facilities = options[FACILITIES];
	const facilityName = getPropValue(facilities, state.facility, ID, NAME);
	const dayType = getPropValue(dayTypes, state.dayType, ID, NAME_ID);
	const operatingHours = getOperatingHoursList(state, dayType, facilities);
	const [newTimeLeft, newIsOpen] = getTimeLeftIsOpen(
		state,
		dayType,
		operatingHours,
		facilities
	);

	const [timeLeft, setTimeLeft] = useState(newTimeLeft);
	const [isOpen, setIsOpen] = useState(newIsOpen);
	useEffect(() => {
		setTimeLeft(newTimeLeft);
		setIsOpen(newIsOpen);
	}, [state, isOpen, timeLeft]);

	return (
		<View>
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
			/>
			<Text>
				The {facilityName} is {isOpen ? 'open' : 'closed'} now.
			</Text>
			<CountDown
				until={timeLeft}
				onFinish={() => {
					const [reevaluatedTimeLeft, reevaluatedIsOpen] = getTimeLeftIsOpen(
						state,
						dayType,
						operatingHours,
						facilities
					);
					setTimeLeft(reevaluatedTimeLeft);
					setIsOpen(reevaluatedIsOpen);
				}}
				size={30}
			/>
			<Text>Till {isOpen ? 'closing' : 'opening'}</Text>
		</View>
	);
};

OperatingHoursScreen.navigationOptions = {
	title: 'Operating Hours'
};

const styles = StyleSheet.create({});

export default OperatingHoursScreen;
