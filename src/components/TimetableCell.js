import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';

const TimetableCell = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.time}>From{'\n'}Leave At</Text>
			<Text style={styles.time}>To{'\n'}Arrive At</Text>
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
