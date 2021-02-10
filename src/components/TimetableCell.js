import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

const TimetableCell = ({ columnTexts }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.time}>{columnTexts.first}</Text>
			<Text style={styles.time}>{columnTexts.second}</Text>
			{/* {showFullTimetable ? null : ( // For the future when implementing notifications.
				<TouchableOpacity>
					<Icon name="bell" type="feather" color="#517fa4" size={20} />
				</TouchableOpacity>
			)} */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
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
