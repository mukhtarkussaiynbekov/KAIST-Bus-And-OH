import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';

const TimetableCell = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.time}>From: Leave at</Text>
			<Text style={styles.time}>To: Arrive at</Text>
			<Text style={styles.time}>Time Left</Text>
			<TouchableOpacity>
				<Feather name="bell" size={20} />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		borderTopWidth: 1,
		alignItems: 'center',
		height: 30
	},
	time: {
		flexWrap: 'wrap',
		width: 110,
		fontSize: 15,
		textAlign: 'center'
	}
});

export default TimetableCell;
