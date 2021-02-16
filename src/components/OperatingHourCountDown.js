import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import { ENGLISH, INFINITY } from '../constants';

const OperatingHourCountDown = ({
	facilityName,
	isOpen,
	timeLeft,
	updateTimeLeft,
	language
}) => {
	return (
		<View style={styles.container}>
			{language === ENGLISH ? (
				<Text style={styles.infoText}>
					The <Text style={styles.boldText}>{facilityName}</Text> is{' '}
					{isOpen ? (
						<Text style={styles.openText}>open</Text>
					) : (
						<Text style={styles.closedText}>closed</Text>
					)}{' '}
					now.
				</Text>
			) : (
				<Text style={styles.infoText}>
					<Text style={styles.boldText}>{facilityName}</Text>는 지금 운영{' '}
					{isOpen ? (
						<Text style={styles.openText}>중입니다</Text>
					) : (
						<Text style={styles.closedText}>중이지 않습니다</Text>
					)}
					.
				</Text>
			)}
			{timeLeft !== INFINITY && (
				<View>
					<CountDown
						until={timeLeft}
						onFinish={updateTimeLeft}
						size={30}
						timeLabels={
							language === ENGLISH
								? { d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' }
								: {
										d: 'DaysKorean',
										h: 'HoursKorean',
										m: 'MinutesKorean',
										s: 'SecondsKorean'
								  }
						}
					/>
					{language === ENGLISH ? (
						<Text style={styles.infoText}>
							Till{' '}
							<Text style={styles.boldText}>
								{isOpen ? 'closing' : 'opening'}
							</Text>
						</Text>
					) : (
						<Text style={styles.infoText}>
							뒤 운영이{' '}
							<Text style={styles.boldText}>
								{isOpen ? '종료됩니다' : '시작됩니다'}
							</Text>
						</Text>
					)}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center'
	},
	infoText: {
		fontSize: 18,
		marginVertical: 10,
		textAlign: 'center',
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
	boldText: {
		fontWeight: 'bold'
	}
});

export default OperatingHourCountDown;
