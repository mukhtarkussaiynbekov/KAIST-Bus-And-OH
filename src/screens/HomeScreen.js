// hooks
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// components
import { View, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import Dropdown from '../components/Dropdown';

// helper functions and constants
import { getPropValue } from '../helperFunctions/commonFunctions';
import { getBusNote, getUpcomingTime } from '../helperFunctions/busHelper';
import {
	getFacilityNote,
	getTimeLeftIsOpen
} from '../helperFunctions/operatingHoursHelper';
import { getUpdates, writeData } from '../firebase';
import {
	NAME,
	TODAY,
	ID,
	NAME_ID,
	BUS_TYPES,
	FACILITIES,
	CHANGE_LANGUAGE,
	ENGLISH
} from '../constants';
import moment from 'moment-timezone';
import * as Linking from 'expo-linking';

const HomeScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(writeData());
		dispatch(getUpdates());
	}, []);

	// get bus and operating hour states from the store
	const {
		bus: busState,
		operatingHours: operatingHoursState,
		holidays: holidaysState,
		language: languageState
	} = useSelector(storeState => storeState);

	// create now state to keep track of current time
	const [now, setNow] = useState(moment().tz('Asia/Seoul'));
	useEffect(() => {
		const interval = setInterval(() => {
			setNow(moment().tz('Asia/Seoul'));
		}, 1000);
		return () => clearInterval(interval);
		// we need to clean up after a component is removed. Otherwise, memory leak.
	}, []);

	// following declarations are needed to render bus data
	const language = getPropValue(
		languageState.items,
		languageState.selected,
		ID,
		NAME_ID
	);
	const busOptions = busState.database.options[language];
	const busTypes = busOptions[BUS_TYPES];
	const busStopsClassfication = getPropValue(
		busTypes,
		busState.busType,
		ID,
		NAME_ID
	);
	const busStops = busOptions[busStopsClassfication];
	const upcomingBusTime = getUpcomingTime(
		busState,
		busTypes,
		busStops,
		now.format('HH:mm'),
		holidaysState
	);
	const from = getPropValue(busStops, busState.from, ID, NAME);
	const to = getPropValue(busStops, busState.to, ID, NAME);
	const busNoteObject = getBusNote(
		busState,
		TODAY,
		busTypes,
		busStops,
		holidaysState
	);
	const busNote = busNoteObject !== undefined ? busNoteObject[language] : '';

	// following declarations are needed to render operating hour data
	const ohOptions = operatingHoursState.database.options[language];
	const facilities = ohOptions[FACILITIES];
	const facilityName = getPropValue(
		facilities,
		operatingHoursState.facility,
		ID,
		NAME
	);
	const [_, isOpen] = getTimeLeftIsOpen(
		operatingHoursState,
		TODAY,
		facilities,
		holidaysState
	);

	const facilityNoteObject = getFacilityNote(
		operatingHoursState,
		TODAY,
		facilities,
		holidaysState,
		now
	);
	const facilityNote =
		facilityNoteObject !== undefined ? facilityNoteObject[language] : '';

	return (
		<View style={styles.container}>
			<Dropdown
				title="Language"
				titleWidth={80}
				items={languageState.items}
				hideSearch={true}
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_LANGUAGE, payload: selectedItem })
				}
				chosenItem={languageState.selected}
			/>
			<View style={styles.featureContainer}>
				{busNote !== '' && (
					<Text style={styles.note}>
						<Text style={styles.boldText}>Note: </Text>
						{busNote}
					</Text>
				)}
				<Text style={styles.text}>
					{upcomingBusTime === undefined ? (
						<Text>
							No bus going from <Text style={styles.boldText}>{from}</Text> to{' '}
							<Text style={styles.boldText}>{to}</Text> today
						</Text>
					) : (
						<Text>
							Next bus from <Text style={styles.boldText}>{from}</Text> to{' '}
							<Text style={styles.boldText}>{to}</Text> leaves at{' '}
							<Text style={styles.boldText}>{upcomingBusTime.leave}</Text>
						</Text>
					)}
				</Text>
				<Button
					icon={
						<Icon
							name="bus"
							type="font-awesome"
							size={20}
							color="white"
							iconStyle={styles.icon}
						/>
					}
					title="Bus Timetable"
					titleStyle={styles.title}
					onPress={() => navigation.navigate('Bus')}
				/>
			</View>
			<View style={styles.featureContainer}>
				<Button
					icon={
						<Icon
							name="home"
							size={20}
							color="white"
							type="font-awesome"
							iconStyle={styles.icon}
						/>
					}
					title="Operating Hours"
					onPress={() => navigation.navigate('OperatingHours')}
					titleStyle={styles.title}
				/>
				<Text style={styles.text}>
					<Text style={styles.boldText}>{facilityName}</Text> is{' '}
					<Text style={styles.boldText}>{isOpen ? 'open' : 'closed'}</Text> now
				</Text>
				{facilityNote !== '' && (
					<Text style={styles.note}>
						<Text style={styles.boldText}>Note: </Text>
						{facilityNote}
					</Text>
				)}
				<Text style={styles.note}>
					If you have any inquiries, please fill out{' '}
					<Text
						style={{ color: 'blue' }}
						onPress={() => Linking.openURL('http://google.com')}
					>
						this form
					</Text>
					.
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	featureContainer: {
		marginVertical: 10
	},
	icon: {
		marginRight: 10
	},
	text: {
		paddingHorizontal: 10,
		textAlign: 'center',
		marginVertical: 10,
		fontSize: 16
	},
	boldText: {
		fontWeight: 'bold'
	},
	note: {
		paddingHorizontal: 10,
		marginVertical: 10,
		fontSize: 16
	}
});

export default HomeScreen;
