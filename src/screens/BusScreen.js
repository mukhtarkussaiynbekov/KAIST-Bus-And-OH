import React, { useReducer } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import busOptions from '../json/busOptions.json';
import TimetableCell from '../components/TimetableCell';
import { firebase } from '../../firebase';

const busTypes = busOptions['busTypes'];
const dayTypes = busOptions['dayTypes'];

const getBusStops = (busOptions, busTypes, typeIndex) => {
	const busType = busTypes[typeIndex];
	const busStopsIdentifier = busType['busStopsReference'];
	return busOptions[busStopsIdentifier];
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'swap_stops':
			const temp = state.from;
			return { ...state, from: state.to, to: temp };
		case 'change_type':
			const busStops = getBusStops(busOptions, busTypes, action.payload);
			return { ...state, type: action.payload, busStops: busStops };
		case 'change_day':
			return { ...state, day: action.payload };
		case 'change_from':
			return { ...state, from: action.payload };
		case 'change_to':
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
		busStops: getBusStops(busOptions, busTypes, 2) // campus stops
	});
	//console.log(state);
	return (
		<View>
			<View style={styles.topDropdowns}>
				<View style={{ flex: 1 }}>
					<Dropdown
						title="Type"
						items={busTypes}
						hideSearch={true}
						onSelectedItemChange={selectedItem =>
							dispatch({ type: 'change_type', payload: selectedItem })
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
							dispatch({ type: 'change_day', payload: selectedItem })
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
					dispatch({ type: 'change_from', payload: selectedItem })
				}
				chosenItem={state.from}
			/>
			<View style={styles.iconContainer}>
				<TouchableOpacity onPress={() => dispatch({ type: 'swap_stops' })}>
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
					dispatch({ type: 'change_to', payload: selectedItem })
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
