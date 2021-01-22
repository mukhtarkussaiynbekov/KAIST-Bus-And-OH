import React, { useReducer, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import busOptions from '../json/busOptions.json';
import TimetableCell from '../components/TimetableCell';
import { store } from '../store/index';
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
	DATA_FETCH_SUCCESS,
	REMOVE_TIME
} from '../constants';
import moment from 'moment-timezone';

const busTypes = busOptions[BUS_TYPES];
const dayTypes = busOptions[DAY_TYPES];

// const getBusStops = (busOptions, busTypes, typeIndex) => {
// 	const busType = busTypes[typeIndex];
// 	const busStopsIdentifier = busType[BUS_STOPS_REFERENCE];
// 	return busOptions[busStopsIdentifier];
// };

// const getTimetable = (busOptions, busTypes, dayTypes, database) => {
// 	let departureTimes =
// 		database.busTimetable.campuses.munjiMain.departureTimes.weekends;
// 	// console.log(departureTimes);
// 	// console.log(database['busTimetable']);
// 	let travelTime = 20;
// 	let timetable = [];
// 	for (let departTime of departureTimes) {
// 		let leaveTime = moment(departTime, 'HH:mm').tz('Asia/Seoul');
// 		let arriveTime = leaveTime.clone().add(travelTime, 'm');
// 		timetable.push({
// 			leave: leaveTime.format('HH:mm'),
// 			arrive: arriveTime.format('HH:mm')
// 		});
// 	}
// 	return timetable;
// };

// const reducer = (state, action) => {
// 	switch (action.type) {
// 		case REMOVE_TIME:
// 			return {
// 				...state,
// 				timetable: state.timetable.filter(time => time !== action.payload)
// 			};
// 		case DATA_FETCH_SUCCESS:
// 			return {
// 				...state,
// 				database: action.payload,
// 				timetable: getTimetable(busOptions, busTypes, dayTypes, action.payload)
// 			};
// 		case SWAP_STOPS:
// 			const temp = state.from;
// 			return {
// 				...state,
// 				from: state.to,
// 				to: temp,
// 				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
// 			};
// 		case CHANGE_TYPE:
// 			const busStops = getBusStops(busOptions, busTypes, action.payload);
// 			return {
// 				...state,
// 				type: action.payload,
// 				busStops: busStops,
// 				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
// 			};
// 		case CHANGE_DAY:
// 			return {
// 				...state,
// 				day: action.payload,
// 				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
// 			};
// 		case CHANGE_FROM:
// 			return {
// 				...state,
// 				from: action.payload,
// 				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
// 			};
// 		case CHANGE_TO:
// 			return {
// 				...state,
// 				to: action.payload,
// 				timetable: getTimetable(busOptions, busTypes, dayTypes, state.database)
// 			};
// 		default:
// 			return state;
// 	}
// };

const BusScreen = () => {
	// const [state, dispatch] = useReducer(reducer, {
	// 	type: 2, // campuses
	// 	day: 0, // today
	// 	from: 0, // main campus
	// 	to: 5, // munji
	// 	busStops: getBusStops(busOptions, busTypes, 2), // campus stops
	// 	database: {},
	// 	timetable: []
	// });
	useEffect(() => {
		getUpdates(store.dispatch);
	}, []);
	console.log(moment().format('HH:mm'));
	// console.log(state.database);
	console.log(store.getState());
	// let timer = setInterval(() => console.log('finish'), 60);
	return (
		<>
			<View style={styles.topDropdowns}>
				<View style={{ flex: 1 }}>
					<Dropdown
						title="Type"
						items={busTypes}
						hideSearch={true}
						onSelectedItemChange={selectedItem =>
							store.dispatch({ type: CHANGE_TYPE, payload: selectedItem })
						}
						chosenItem={store.getState().type}
					/>
				</View>
				<View style={{ flex: 1 }}>
					<Dropdown
						title="Day"
						items={dayTypes}
						hideSearch={true}
						onSelectedItemChange={selectedItem =>
							store.dispatch({ type: CHANGE_DAY, payload: selectedItem })
						}
						chosenItem={store.getState().day}
					/>
				</View>
			</View>
			<Dropdown
				title="From"
				items={store.getState().busStops}
				searchPlaceholderText="Search a bus stop"
				onSelectedItemChange={selectedItem =>
					store.dispatch({ type: CHANGE_FROM, payload: selectedItem })
				}
				chosenItem={store.getState().from}
			/>
			<View style={styles.iconContainer}>
				<TouchableOpacity onPress={() => store.dispatch({ type: SWAP_STOPS })}>
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
				items={store.getState().busStops}
				searchPlaceholderText="Search a bus stop"
				onSelectedItemChange={selectedItem =>
					store.dispatch({ type: CHANGE_TO, payload: selectedItem })
				}
				chosenItem={store.getState().to}
			/>
			<TimetableCell
				firstColumnText={'From\nLeave At'}
				secondColumnText={'To\nArrive At'}
				thirdColumnText="Time Left"
				isHeader
			/>
			<FlatList
				data={store.getState().timetable}
				keyExtractor={time => time.leave}
				renderItem={({ item }) => {
					return (
						<TimetableCell
							firstColumnText={item.leave}
							secondColumnText={item.arrive}
							timeOut={() =>
								store.dispatch({ type: REMOVE_TIME, payload: item })
							}
						/>
					);
				}}
			/>
		</>
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
