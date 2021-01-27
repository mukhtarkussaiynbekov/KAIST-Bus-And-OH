import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import moment from 'moment-timezone';

const getTimeLeft = time => {
	let leaveTime = moment.duration(time, 'HH:mm');
	let nowFormatted = moment().format('HH:mm:ss');
	let now = moment.duration(nowFormatted, 'HH:mm:ss');
	let timeLeft = leaveTime.asSeconds() - now.asSeconds();
	if (leaveTime.hours() < 4 && now.hours() > leaveTime.hours()) {
		timeLeft += 24 * 60 * 60;
	}
	return timeLeft;
};

const TimetableCell = ({
	firstColumnText,
	secondColumnText,
	isHeader,
	timeOut,
	showFullTimetable
}) => {
	if (!isHeader && !showFullTimetable) {
		const [timeLeft, setTimeLeft] = useState(getTimeLeft(firstColumnText));
		useEffect(() => {
			// using useEffect to avoid Warning: Cannot update a component from
			// inside the function body of a different component.
			// If you want to call parent function that will update (remove)
			// current component, then you should call it inside useEffect
			if (timeLeft <= -200) {
				timeOut();
			}
		}, [timeLeft]);

		useEffect(() => {
			const interval = setInterval(() => {
				setTimeLeft(timeLeft => timeLeft - 1);
			}, 1000);
			return () => clearInterval(interval);
		}, []);
		// setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.time}>{firstColumnText}</Text>
			<Text style={styles.time}>{secondColumnText}</Text>
			{showFullTimetable ? null : (
				<TouchableOpacity>
					<Icon name="bell" type="feather" color="#517fa4" size={20} />
				</TouchableOpacity>
			)}
		</View>
	);
};

TimetableCell.defaultProps = {
	isHeader: false,
	showFullTimetable: false
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		borderTopWidth: 1,
		alignItems: 'center',
		height: 40
	},
	time: {
		flexWrap: 'wrap',
		fontSize: 15,
		textAlign: 'center',
		flex: 1
	}
});

export default TimetableCell;
