import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import moment from 'moment-timezone';

const getTimeLeft = time => {
	let leaveTime = moment.duration(time, 'HH:mm');
	let now = moment().format('HH:mm:ss');
	let timeLeft =
		leaveTime.asSeconds() - moment.duration(now, 'HH:mm:ss').asSeconds();
	return timeLeft;
};

const displayTime = time => {
	let duration = moment.duration(time, 'seconds');
	let days = duration.days();
	let hours = duration.hours();
	let minutes = duration.minutes();
	let seconds = duration.seconds();
	if (days > 0) {
		return (
			<Text
				style={styles.time}
			>{`${days}d:${hours}h:${minutes}m:${seconds}s`}</Text>
		);
	} else if (hours > 0) {
		return (
			<Text style={styles.time}>{`${hours}h:${minutes}m:${seconds}s`}</Text>
		);
	} else if (minutes > 0) {
		return <Text style={styles.time}>{`${minutes}m:${seconds}s`}</Text>;
	} else {
		return <Text style={styles.time}>{`${seconds}s`}</Text>;
	}
};

const TimetableCell = ({
	firstColumnText,
	secondColumnText,
	thirdColumnText,
	isHeader,
	timeOut
}) => {
	if (isHeader) {
		return (
			<View style={styles.container}>
				<Text style={styles.time}>{firstColumnText}</Text>
				<Text style={styles.time}>{secondColumnText}</Text>
				<Text style={styles.time}>{thirdColumnText}</Text>
				<TouchableOpacity>
					<Icon name="bell" type="feather" color="#517fa4" size={20} />
				</TouchableOpacity>
			</View>
		);
	}

	const [timeLeft, setTimeLeft] = useState(getTimeLeft(firstColumnText));
	if (timeLeft <= 0) {
		// timeOut();
		return null;
	}
	setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
	return (
		<View style={styles.container}>
			<Text style={styles.time}>{firstColumnText}</Text>
			<Text style={styles.time}>{secondColumnText}</Text>
			{displayTime(timeLeft)}
			<TouchableOpacity>
				<Icon name="bell" type="feather" color="#517fa4" size={20} />
			</TouchableOpacity>
		</View>
	);
};

TimetableCell.defaultProps = {
	isHeader: false
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
