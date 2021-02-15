import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import { INFINITY } from '../constants';

const OperatingHourCountDown = ({
	facilityName,
	isOpen,
	timeLeft,
	updateTimeLeft
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.infoText}>
				The <Text style={styles.boldText}>{facilityName}</Text> is{' '}
				{isOpen ? (
					<Text style={styles.openText}>open</Text>
				) : (
					<Text style={styles.closedText}>closed</Text>
				)}{' '}
				now.
			</Text>
			{timeLeft !== INFINITY && (
				<View>
					<CountDown until={timeLeft} onFinish={updateTimeLeft} size={30} />
					<Text style={styles.infoText}>
						Till{' '}
						<Text style={styles.boldText}>
							{isOpen ? 'closing' : 'opening'}
						</Text>
					</Text>
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
