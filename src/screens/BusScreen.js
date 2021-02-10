import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
import { getTimetable, getTimeLeftBus } from '../helperFunctions/busHelper';
import { getPropValue } from '../helperFunctions/commonFunctions';
import moment from 'moment-timezone';
import Timetable from '../components/Timetable';

const BusScreen = () => {
	const state = useSelector(storeState => storeState.bus);
	const dispatch = useDispatch();
	const [now, setNow] = useState(moment().tz('Asia/Seoul'));
	const [flatListRendered, setFlatListRendered] = useState(false);
	const busOptions = state.database.busOptions;
	const dayTypes = busOptions[DAY_TYPES];
	const dayType = getPropValue(dayTypes, state.dayType, ID, NAME_ID);
	const busTypes = busOptions[BUS_TYPES];
	const busStopsClassfication = getPropValue(
		busTypes,
		state.busType,
		ID,
		NAME_ID
	);
	const busStops = busOptions[busStopsClassfication];
	const [timetable, setTimetable] = useState(
		getTimetable(state, dayType, busTypes, busStops)
	);
	useEffect(() => {
		setTimetable(getTimetable(state, dayType, busTypes, busStops));
	}, [state]);
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
			setFlatListRendered(true);
			setNow(moment().tz('Asia/Seoul'));
		}, 1000);
		return () => clearInterval(interval);
		// we need to clean up after a component is removed. Otherwise, memory leak.
	}, []);
	let nowFormatted = now.format('HH:mm');
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
			<Timetable
				header={
					<TimetableCell
						columnTexts={{ first: 'From\nLeave At', second: 'To\nArrive At' }}
					/>
				}
				timetable={timetable}
				renderFunction={({ item, index }) => {
					if (flatListRendered && dayType === TODAY) {
						let timeLeft = getTimeLeftBus(item.leave, nowFormatted, index);
						if (timeLeft <= -5) {
							return null;
						}
					}
					return (
						<TimetableCell
							columnTexts={{ first: item.leave, second: item.arrive }}
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
