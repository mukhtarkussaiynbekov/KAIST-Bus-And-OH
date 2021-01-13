import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import { Ionicons } from '@expo/vector-icons';
import busOptions from '../json/busOptions.json';

const busStops = [
	// this is the parent or 'item'
	{
		name: 'Main Campus (본교)',
		id: 1,
		// these are the children or 'sub items'
		children: [
			{
				name: 'N6',
				id: 11
			},
			{
				name: 'Auditorium',
				id: 12
			},
			{
				name: 'W8',
				id: 13
			},
			{
				name: 'Duck pond',
				id: 14
			}
		]
	},
	{
		name: 'Munji Campus (문지)',
		id: 2
	},
	{
		name: 'Hwaam Campus (화암)',
		id: 3
	},
	{
		name: 'Rothen House (로덴 하우스)',
		id: 4
	},
	{
		name: 'Faculty Apartment (교수 아파트)',
		id: 5
	},
	{
		name: 'Chungnam National University (충남태학교)',
		id: 6
	},
	{
		name: 'Wolpyeong St. Exit #1',
		id: 7
	},
	{
		name: 'Galleria Department Store',
		id: 8
	},
	{
		name: 'Government Complex',
		id: 9
	},
	{
		name: 'Wolpyeong St. Exit #3',
		id: 10
	}
];

const dayTypes = [
	{
		name: 'Today',
		id: 1
	},
	{
		name: 'Tomorrow',
		id: 2
	},
	{
		name: 'Weekdays',
		id: 3
	},
	{
		name: 'Weekends/Holidays',
		id: 4
	}
];

const BusScreen = () => {
	console.log(busOptions);
	const busTypes = busOptions['busTypes'];
	console.log(busTypes);
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
				items={busStops}
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
				items={busStops}
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
