import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { TODAY } from '../constants';
import { getTimeLeft } from '../reducers/helperFunctions';

const TimetableCell = ({
	firstColumnText,
	secondColumnText,
	isHeader,
	timeOut,
	dayType
}) => {
	if (!isHeader && dayType === TODAY) {
		// using let declaration because we need to change value
		// internally and do not want to render on screen.
		// If you need to render it on screen, then use useState hook.
		// Since we are avoiding rendering component again and again,
		// we are potentially saving a phone's energy.
		let timeLeft = getTimeLeft(firstColumnText);

		useEffect(() => {
			// using useEffect to avoid Warning: Cannot update a component from
			// inside the function body of a different component.
			// If you want to call parent function that will update (remove)
			// current component, then you should call it inside useEffect
			const interval = setInterval(() => {
				if (timeLeft <= -300) {
					timeOut();
				}
				timeLeft -= 1;
			}, 1000);
			return () => clearInterval(interval);
			// we need to clean up after a component is removed. Otherwise, memory leak.
		}, []);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.time}>{firstColumnText}</Text>
			<Text style={styles.time}>{secondColumnText}</Text>
			{/* {showFullTimetable ? null : ( // For the future when implementing notifications.
				<TouchableOpacity>
					<Icon name="bell" type="feather" color="#517fa4" size={20} />
				</TouchableOpacity>
			)} */}
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
		// paddingHorizontal: 10,
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
