import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeProvider, Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '../components/Dropdown';
import CountDown from 'react-native-countdown-component';
import { getOHJSON, getTimeLeftOH } from '../reducers/helperFunctions';
import moment from 'moment-timezone';

const OperatingHoursScreen = () => {
	const state = useSelector(storeState => storeState.operatingHours);
	const dispatch = useDispatch();
	const [now, setNow] = useState(moment().tz('Asia/Seoul'));
	let jsonFile = require('../json/operatingHoursData/mejom/n12.json');
	getOHJSON(state);
	// console.log(jsonFile);
	// const finish = facilityData['operatingHours'][0]['hours']['Monday']['finish'];
	// const timeLeft = getTimeLeftOH(finish);
	return (
		<View>
			<Dropdown
				title="Day"
				items={state.dayType.items}
				hideSearch={true}
				onSelectedItemChange={selectedItem =>
					dispatch({ type: 'operatingHoursDay', payload: selectedItem })
				}
				chosenItem={state.dayType.selected}
			/>
			<Dropdown
				title="Facility"
				items={state.facility.items}
				searchPlaceholderText="Search a facility"
				onSelectedItemChange={selectedItem =>
					dispatch({ type: 'changeFacility', payload: selectedItem })
				}
				chosenItem={state.facility.selected}
			/>
			<CountDown
				until={1000}
				onFinish={() => setNow(moment().tz('Asia/Seoul'))}
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
