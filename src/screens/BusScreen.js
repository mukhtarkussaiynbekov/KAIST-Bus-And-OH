import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import TimetableCell from '../components/TimetableCell';
import { useSelector, useDispatch } from 'react-redux';
import {
	NAME_ID,
	ID,
	TODAY,
	SWAP_STOPS,
	CHANGE_TYPE,
	CHANGE_FROM,
	CHANGE_TO,
	CHANGE_DAY,
	BUS_TYPES,
	DAY_TYPES
} from '../constants';
import {
	getPropValue,
	getTimeLeft,
	getTimetable
} from '../reducers/helperFunctions';
import moment from 'moment-timezone';

const BusScreen = () => {
	const state = useSelector(storeState => storeState.bus);
	const dispatch = useDispatch();
	const [timetable, setTimetable] = useState(getTimetable(state));
	const [now, setNow] = useState(moment().tz('Asia/Seoul'));
	const busOptions = state.database.busOptions;
	const dayTypes = busOptions[DAY_TYPES];
	const dayType = getPropValue(dayTypes, state.dayType, ID, NAME_ID);
	const busTypes = busOptions[BUS_TYPES];
	const busStopsClassfication = getPropValue(
		busOptions[BUS_TYPES],
		state.busType,
		ID,
		NAME_ID
	);
	const busStops = busOptions[busStopsClassfication];
	useEffect(() => {
		const interval = setInterval(() => {
			if (
				now.format('HH:mm:ss') === '00:00:00' ||
				now.format('HH:mm:ss') === '00:00:01'
			) {
				// added second condition just in case program
				// might run slowly and miss first condition
				dispatch({ type: '' });
			}
			setNow(moment().tz('Asia/Seoul'));
		}, 1000);
		return () => clearInterval(interval);
		// we need to clean up after a component is removed. Otherwise, memory leak.
	}, []);
	return (
		<>
			<View style={styles.topDropdowns}>
				<View style={{ flex: 1 }}>
					<Dropdown
						title="Type"
						items={busTypes}
						hideSearch={true}
						onSelectedItemChange={selectedItem =>
							dispatch({ type: CHANGE_TYPE, payload: selectedItem })
						}
						chosenItem={state.busType}
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
						chosenItem={state.dayType}
					/>
				</View>
			</View>
			<Dropdown
				title="From"
				items={busStops}
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
				items={busStops}
				searchPlaceholderText="Search a bus stop"
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_TO, payload: selectedItem })
				}
				chosenItem={state.to}
			/>
			<TimetableCell
				firstColumnText={'From\nLeave At'}
				secondColumnText={'To\nArrive At'}
			/>
			<FlatList
				data={timetable}
				keyExtractor={(time, index) => index.toString()}
				renderItem={({ item, index }) => {
					if (dayType === TODAY) {
						let timeLeft = getTimeLeft(item.leave, index);
						if (timeLeft <= -5) {
							return null;
						}
					}
					return (
						<TimetableCell
							firstColumnText={item.leave}
							secondColumnText={item.arrive}
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
