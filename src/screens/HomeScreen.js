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
	ENGLISH,
	TIMETABLE_LINK,
	FEEDBACK_LINK,
	KOREAN
} from '../constants';
import moment from 'moment-timezone';
import * as Linking from 'expo-linking';

const HomeScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		// dispatch(writeData());
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
	const [, isOpen, , timeMessage] = getTimeLeftIsOpen(
		operatingHoursState,
		TODAY,
		facilities,
		holidaysState,
		language === KOREAN
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
						<Text style={styles.boldText}>
							{language === ENGLISH ? 'Note' : '참고'}:{' '}
						</Text>
						{busNote}
					</Text>
				)}
				<Text style={styles.text}>
					{upcomingBusTime === undefined ? (
						language === ENGLISH ? (
							<Text>
								No bus going from <Text style={styles.boldText}>{from}</Text> to{' '}
								<Text style={styles.boldText}>{to}</Text> today
							</Text>
						) : (
							<Text>
								오늘은 <Text style={styles.boldText}>{from}</Text>에서{' '}
								<Text style={styles.boldText}>{to}</Text>로 가는 버스가 운행하지
								않습니다.
							</Text>
						)
					) : language === ENGLISH ? (
						<Text>
							Next bus from <Text style={styles.boldText}>{from}</Text> to{' '}
							<Text style={styles.boldText}>{to}</Text> leaves at{' '}
							<Text style={styles.boldText}>{upcomingBusTime.leave}</Text>
						</Text>
					) : (
						<Text>
							<Text style={styles.boldText}>{from}</Text>에서{' '}
							<Text style={styles.boldText}>{to}</Text>로 가는 다음 버스는{' '}
							<Text style={styles.boldText}>{upcomingBusTime.leave}</Text>에
							출발합니다.
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
					title={language === ENGLISH ? 'Bus Timetable' : '버스 시간표'}
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
					title={language === ENGLISH ? 'Operating Hours' : '운영 시간'}
					onPress={() => navigation.navigate('OperatingHours')}
					titleStyle={styles.title}
				/>
				{language === ENGLISH ? (
					<Text style={styles.text}>
						The <Text style={styles.boldText}>{facilityName}</Text> is{' '}
						<Text style={styles.boldText}>{isOpen ? 'open' : 'closed'}</Text>{' '}
						now.{' '}
						<Text style={styles.boldText}>
							{isOpen ? 'Closes' : 'Opens'} at {timeMessage}
						</Text>
					</Text>
				) : (
					<Text style={styles.text}>
						<Text style={styles.boldText}>{facilityName}</Text>는 지금 운영{' '}
						<Text style={styles.boldText}>
							{isOpen ? '중입니다' : '중이지 않습니다'}
						</Text>
						.{' '}
						<Text style={styles.boldText}>
							{timeMessage}에 {isOpen ? '닫습니다' : '엽니다'}.
						</Text>
					</Text>
				)}
				{facilityNote !== '' && (
					<Text style={styles.note}>
						<Text style={styles.boldText}>
							{language === ENGLISH ? 'Note' : '참고'}:{' '}
						</Text>
						{facilityNote}
					</Text>
				)}
				<Text style={styles.note}>
					{language === ENGLISH
						? 'Any suggestions? '
						: '건의사항이 있으신가요? '}
					<Text
						style={{ color: 'blue' }}
						onPress={() => Linking.openURL(TIMETABLE_LINK)}
					>
						{language === ENGLISH
							? 'Report schedule changes'
							: '스케쥴 변경을 제보'}
					</Text>{' '}
					{language === ENGLISH ? 'or' : '하시거나'}{' '}
					<Text
						style={{ color: 'blue' }}
						onPress={() => Linking.openURL(FEEDBACK_LINK)}
					>
						{language === ENGLISH ? 'leave a feedback' : '피드백을 남겨'}
					</Text>
					{language === ENGLISH ? '.' : ' 주세요!'}
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
