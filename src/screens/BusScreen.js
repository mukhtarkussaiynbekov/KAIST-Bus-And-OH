import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import { Ionicons } from '@expo/vector-icons';
import busOptions from '../json/busOptions.json';

const busTypes = busOptions['busTypes'];
const dayTypes = busOptions['dayTypes'];
const cityStops = busOptions['cityStops'];
const campusStops = busOptions['campusStops'];

const BusScreen = () => {
	return (
		<View>
			<View style={styles.topDropdowns}>
				<View style={{ flex: 1 }}>
					<Dropdown title="Type" items={busTypes} hideSearch={true} />
				</View>
				<View style={{ flex: 1 }}>
					<Dropdown title="Day" items={dayTypes} hideSearch={true} />
				</View>
			</View>
			<Dropdown
				title="From"
				items={campusStops}
				searchPlaceholderText="Search a bus stop"
			/>
			<View style={styles.iconContainer}>
				<TouchableOpacity>
					<Ionicons name="swap-vertical" style={styles.icon} />
				</TouchableOpacity>
				<Text style={styles.iconGuide}>Press to swap locations</Text>
			</View>
			<Dropdown
				title="To"
				items={campusStops}
				searchPlaceholderText="Search a bus stop"
			/>
		</View>
	);
};

BusScreen.navigationOptions = {
	title: 'Bus Timetable'
};

const styles = StyleSheet.create({
	topDropdowns: {
		flexDirection: 'row'
		// justifyContent: "space-evenly",
	},
	iconContainer: {
		flexDirection: 'row',
		alignSelf: 'center'
	},
	icon: {
		fontSize: 30
	},
	iconGuide: {
		paddingLeft: 20,
		alignSelf: 'center'
	}
});

export default BusScreen;
