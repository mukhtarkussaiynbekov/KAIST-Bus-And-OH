import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import moment from 'moment';

const getTimeLeft = time => {
	let leaveTime = moment(time, 'HH:mm');
	let timeLeft = leaveTime.clone().diff(moment());
	return timeLeft;
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
	// useEffect({}, []);
	return (
		<View style={styles.container}>
			<Text style={styles.time}>{firstColumnText}</Text>
			<Text style={styles.time}>{secondColumnText}</Text>
			<Text style={styles.time}>{timeLeft}s</Text>
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
