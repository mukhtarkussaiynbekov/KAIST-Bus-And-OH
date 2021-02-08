import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeProvider, Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '../components/Dropdown';
import CountDown from 'react-native-countdown-component';
import { getPropValue } from '../helperFunctions/commonFunctions';
import { getOperatingHoursList } from '../helperFunctions/operatingHoursHelper';
import {
	CHANGE_OH_DAY,
	CHANGE_FACILITY,
	DAY_TYPES,
	FACILITIES,
	ID,
	NAME_ID,
	TODAY,
	YESTERDAY
} from '../constants';

const OperatingHoursScreen = () => {
	const state = useSelector(storeState => storeState.operatingHours);
	const dispatch = useDispatch();
	const [timeLeft, setTimeLeft] = useState(1000);
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		setTimeLeft(1000);
	}, [state]);

	const options = state.database.options;
	const dayTypes = options[DAY_TYPES];
	const facilities = options[FACILITIES];
	const dayType = getPropValue(dayTypes, state.dayType, ID, NAME_ID);
	const ohHours = getOperatingHoursList(state, dayType, facilities);
	if (dayType === TODAY) {
		const yesterdayHours = getOperatingHoursList(state, YESTERDAY, facilities);
		console.log(yesterdayHours);
	}

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
			<CountDown
				until={timeLeft}
				onFinish={() => setTimeLeft(1000)}
				size={30}
			/>
		</View>
	);
};

OperatingHoursScreen.navigationOptions = {
	title: 'Operating Hours'
};

const styles = StyleSheet.create({});

export default OperatingHoursScreen;
