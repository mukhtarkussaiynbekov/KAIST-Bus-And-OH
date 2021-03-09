// hooks
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// components
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import OperatingHourCountDown from '../components/OperatingHourCountDown';

// helper functions and constants
import { getPropValue } from '../helperFunctions/commonFunctions';
import { getBusNote, getUpcomingTime } from '../helperFunctions/busHelper';
import { getClassFacility } from '../helperFunctions/operatingHoursHelper';
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
	CHILDREN,
	PROGRESS_LINK
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

	const facilityFullNameID = getPropValue(
		facilities,
		operatingHoursState.facility,
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
		let facilityName = getPropValue(
			facilities,
			operatingHoursState.facility,
			ID,
			NAME
		);
		displayOperatingHours = [
			{ [ID]: operatingHoursState.facility, [NAME]: facilityName }
		];
	}

	return (
		<>
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
				buttonStyle={styles.button}
			/>
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
				buttonStyle={styles.button}
			/>
			<FlatList
				data={displayOperatingHours}
				keyExtractor={facility => facility[ID].toString()}
				renderItem={({ item }) => {
					return (
						<OperatingHourCountDown
							state={operatingHoursState}
							language={language}
							facilityID={item[ID]}
							facilityName={item[NAME]}
							holidays={holidaysState}
						/>
					);
				}}
			/>
			<Text style={styles.note}>
				{language === ENGLISH ? 'Any suggestions? ' : '건의사항이 있으신가요? '}
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
				{'\n'}
				{language === ENGLISH
					? 'We value your feedback. Check out our '
					: '학우분들께서 남겨주신 피드백에 대한 '}
				<Text
					style={{ color: 'blue' }}
					onPress={() => Linking.openURL(PROGRESS_LINK)}
				>
					{language === ENGLISH
						? 'current progress.'
						: '진행 상황을 체크해 보세요.'}
				</Text>
			</Text>
		</>
	);
};

const styles = StyleSheet.create({
	button: {
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
