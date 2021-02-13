// hooks
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// components
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import Timetable from '../components/Timetable';
import TimetableCell from '../components/TimetableCell';

// helper functions and constants
import { getPropValue } from '../helperFunctions/commonFunctions';
import {
	getTimetable,
	getTimeLeftBus,
	getBusNote
} from '../helperFunctions/busHelper';
import moment from 'moment-timezone';
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

const BusScreen = () => {
	// get bus state and dispatch from the store
	const [state, holidays] = useSelector(storeState => [
		storeState.bus,
		storeState.holidays
	]);
	const dispatch = useDispatch();

	// create now state to keep track of current time
	const [now, setNow] = useState(moment().tz('Asia/Seoul'));
	let nowFormatted = now.format('HH:mm');

	// create flastListRendered to render every data in first render.
	// this is needed because flat list does not render any item
	// if we start off by usig our main logic. This is probably
	// due to large amount of data (in our case more than 10)
	const [flatListRendered, setFlatListRendered] = useState(false);

	// following declarations are needed to get timetable and
	// to render flat list as well as drop downs.
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
	const busNote = getBusNote(state, dayType, busTypes, busStops, holidays);

	const [timetable, setTimetable] = useState(
		getTimetable(state, dayType, busTypes, busStops, holidays)
	);

	useEffect(() => {
		// update timetable whenever state changes
		setTimetable(getTimetable(state, dayType, busTypes, busStops, holidays));
	}, [state]);

	useEffect(() => {
		// set interval to update current time every second
		const interval = setInterval(() => {
			// update timetable at midnight to show following day's timetable
			if (now.format('HH:mm:ss') <= '00:00:02') {
				setTimetable(
					getTimetable(state, dayType, busTypes, busStops, holidays)
				);
			}
			if (!flatListRendered) {
				setFlatListRendered(true);
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
			{busNote !== '' && (
				<Text style={styles.text}>
					<Text style={styles.boldText}>Note: </Text>
					{busNote}
				</Text>
			)}
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
	},
	text: {
		marginHorizontal: 10,
		marginVertical: 10,
		fontSize: 16
	},
	boldText: {
		fontWeight: 'bold'
	}
});

export default BusScreen;
