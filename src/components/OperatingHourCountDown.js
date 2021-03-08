import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import {
	ENGLISH,
	KOREAN,
	INFINITY,
	DAY_TYPES,
	NAME_ID,
	ID,
	FACILITIES,
	OPERATING_HOURS
} from '../constants';

// helper functions and constants
import { getPropValue } from '../helperFunctions/commonFunctions';
import {
	getFacilityNote,
	getTimeLeftIsOpen
} from '../helperFunctions/operatingHoursHelper';

const OperatingHourCountDown = ({
	state,
	language,
	holidays,
	showCountDown,
	facilityID,
	facilityName
}) => {
	const options = state.database.options[language];
	const dayTypes = options[DAY_TYPES];
	const dayType = getPropValue(dayTypes, state.dayType, ID, NAME_ID);
	const facilities = options[FACILITIES];

	const listOfOperatingHours = state.database.operatingHours[OPERATING_HOURS];

	const facilityNoteObject = getFacilityNote(
		facilityID,
		listOfOperatingHours,
		dayType,
		facilities,
		holidays
	);
	const facilityNote =
		facilityNoteObject !== undefined ? facilityNoteObject[language] : '';

	const [
		initialTimeLeft,
		initialIsOpen,
		,
		inititalTimeMessage
	] = getTimeLeftIsOpen(
		facilityID,
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
			facilityID,
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

	const updateTimeLeft = () => {
		const [
			reevaluatedTimeLeft,
			reevaluatedIsOpen,
			,
			reevaluatedTimeMessage
		] = getTimeLeftIsOpen(
			facilityID,
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
	};

	return (
		<View>
			{facilityNote !== '' && (
				<Text style={styles.note}>
					<Text style={styles.boldText}>
						{language === ENGLISH ? 'Note' : '참고'}:{' '}
					</Text>
					{facilityNote}
				</Text>
			)}
			<View style={showCountDown && styles.countDown}>
				{language === ENGLISH ? (
					<Text style={styles.infoText}>
						The <Text style={styles.boldText}>{facilityName}</Text> is{' '}
						{facilityInfo.isOpen ? (
							<Text style={styles.openText}>open</Text>
						) : (
							<Text style={styles.closedText}>closed</Text>
						)}{' '}
						now.{' '}
						{facilityInfo.timeMessage && (
							<Text>
								{facilityInfo.isOpen ? 'Closes' : 'Opens'} at{' '}
								{facilityInfo.timeMessage}
							</Text>
						)}
					</Text>
				) : (
					<Text style={styles.infoText}>
						<Text style={styles.boldText}>{facilityName}</Text>는 지금 운영{' '}
						{facilityInfo.isOpen ? (
							<Text style={styles.openText}>중입니다</Text>
						) : (
							<Text style={styles.closedText}>중이지 않습니다</Text>
						)}
						.{' '}
						{facilityInfo.timeMessage && (
							<Text>
								{facilityInfo.timeMessage}에{' '}
								{facilityInfo.isOpen ? '닫습니다' : '엽니다'}.
							</Text>
						)}
					</Text>
				)}
				{facilityInfo.timeLeft !== INFINITY && (
					<View style={{ display: showCountDown ? '' : 'none' }}>
						<CountDown
							until={facilityInfo.timeLeft}
							onFinish={updateTimeLeft}
							size={30}
							timeLabels={
								language === ENGLISH
									? { d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' }
									: {
											d: '일',
											h: '시간',
											m: '분',
											s: '초'
									  }
							}
						/>
						{language === ENGLISH ? (
							<Text style={styles.countDownInfoText}>
								Till{' '}
								<Text style={styles.boldText}>
									{facilityInfo.isOpen ? 'closing' : 'opening'}
								</Text>
							</Text>
						) : (
							<Text style={styles.countDownInfoText}>
								뒤 운영이{' '}
								<Text style={styles.boldText}>
									{facilityInfo.isOpen ? '종료됩니다' : '시작됩니다'}
								</Text>
							</Text>
						)}
					</View>
				)}
			</View>
		</View>
	);
};

OperatingHourCountDown.defaultProps = {
	showCountDown: false
};

const styles = StyleSheet.create({
	countDownInfoText: {
		alignSelf: 'center',
		fontSize: 18,
		marginVertical: 10,
		paddingHorizontal: 10
	},
	infoText: {
		fontSize: 18,
		marginVertical: 10,
		paddingHorizontal: 10
	},
	closedText: {
		color: 'red',
		fontWeight: 'bold'
	},
	openText: {
		color: 'green',
		fontWeight: 'bold'
	},
	countDown: {
		marginTop: 40
	},
	note: {
		paddingHorizontal: 10,
		marginTop: 10,
		fontSize: 16
	},
	boldText: {
		fontWeight: 'bold'
	}
});

export default OperatingHourCountDown;
