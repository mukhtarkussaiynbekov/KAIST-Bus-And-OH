import React, { useReducer } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import { Ionicons } from '@expo/vector-icons';
import busOptions from '../json/busOptions.json';

const busTypes = busOptions['busTypes'];
const dayTypes = busOptions['dayTypes'];
const cityStops = busOptions['cityStops'];
const campusStops = busOptions['campusStops'];

const reducer = (state, action) => {
	switch (action.type) {
		case 'change_type':
			return { ...state, type: action.payload };
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
		to: 5 // munji
	});
	console.log(state);
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
						initialSelectedItem={state.type}
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
						initialSelectedItem={state.day}
					/>
				</View>
			</View>
			<Dropdown
				title="From"
				items={campusStops}
				searchPlaceholderText="Search a bus stop"
				onSelectedItemChange={selectedItem =>
					dispatch({ type: 'change_from', payload: selectedItem })
				}
				initialSelectedItem={state.from}
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
				onSelectedItemChange={selectedItem =>
					dispatch({ type: 'change_to', payload: selectedItem })
				}
				initialSelectedItem={state.to}
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
