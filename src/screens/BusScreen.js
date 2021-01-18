import React, { useReducer, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import busOptions from '../json/busOptions.json';
import TimetableCell from '../components/TimetableCell';
import { getUpdates } from '../firebase';
import {
	BUS_STOPS_REFERENCE,
	BUS_TYPES,
	DAY_TYPES,
	BUS_STOP_CONNECTIONS,
	SWAP_STOPS,
	CHANGE_TYPE,
	CHANGE_FROM,
	CHANGE_TO,
	CHANGE_DAY,
	DATA_FETCH_SUCCESS
} from '../constants';

const busTypes = busOptions[BUS_TYPES];
const dayTypes = busOptions[DAY_TYPES];

const getBusStops = (busOptions, busTypes, typeIndex) => {
	const busType = busTypes[typeIndex];
	const busStopsIdentifier = busType[BUS_STOPS_REFERENCE];
	return busOptions[busStopsIdentifier];
};

const getTimetable = (busOptions, busTypes, dayTypes, state) => {};

const reducer = (state, action) => {
	switch (action.type) {
		case DATA_FETCH_SUCCESS:
			return { ...state, database: action.payload };
		case SWAP_STOPS:
			const temp = state.from;
			return { ...state, from: state.to, to: temp };
		case CHANGE_TYPE:
			const busStops = getBusStops(busOptions, busTypes, action.payload);
			return { ...state, type: action.payload, busStops: busStops };
		case CHANGE_DAY:
			return { ...state, day: action.payload };
		case CHANGE_FROM:
			return { ...state, from: action.payload };
		case CHANGE_TO:
			return { ...state, to: action.payload };
		default:
			return state;
	}
};

const BusScreen = () => {
	const [state, dispatch] = useReducer(reducer, {
		type: 2, // campuses
		day: 0, // today
		from: 0, // main campus
		to: 5, // munji
		busStops: getBusStops(busOptions, busTypes, 2), // campus stops
		database: {},
		timetable: []
	});
	useEffect(() => {
		getUpdates(dispatch);
	}, []);
	console.log(state.database);
	return (
		<View>
			<View style={styles.topDropdowns}>
				<View style={{ flex: 1 }}>
					<Dropdown
						title="Type"
						items={busTypes}
						hideSearch={true}
						onSelectedItemChange={selectedItem =>
							dispatch({ type: CHANGE_TYPE, payload: selectedItem })
						}
						chosenItem={state.type}
					/>
				</View>
				<View style={{ flex: 1 }}>
					<Dropdown
						title="Day"
						items={dayTypes}
						hideSearch={true}
						onSelectedItemChange={selectedItem =>
							dispatch({ type: CHANGE_DAY, payload: selectedItem })
						}
						chosenItem={state.day}
					/>
				</View>
			</View>
			<Dropdown
				title="From"
				items={state.busStops}
				searchPlaceholderText="Search a bus stop"
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_FROM, payload: selectedItem })
				}
				chosenItem={state.from}
			/>
			<View style={styles.iconContainer}>
				<TouchableOpacity onPress={() => dispatch({ type: SWAP_STOPS })}>
					<Icon
						reverse
						name="swap-vertical"
						type="ionicon"
						color="#517fa4"
						size={20}
					/>
				</TouchableOpacity>
				<Text style={styles.iconGuide}>Press to swap locations</Text>
			</View>
			<Dropdown
				title="To"
				items={state.busStops}
				searchPlaceholderText="Search a bus stop"
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_TO, payload: selectedItem })
				}
				chosenItem={state.to}
			/>
			<TimetableCell />
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
	iconGuide: {
		paddingLeft: 20,
		alignSelf: 'center'
	}
});

export default BusScreen;
