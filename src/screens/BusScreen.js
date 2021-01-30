import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import Dropdown from '../components/Dropdown';
import TimetableCell from '../components/TimetableCell';
import { useSelector, useDispatch } from 'react-redux';
import {
	NAME_ID,
	ID,
	SWAP_STOPS,
	CHANGE_TYPE,
	CHANGE_FROM,
	CHANGE_TO,
	CHANGE_DAY,
	REMOVE_TIME
} from '../constants';
import { getPropValue } from '../reducers/helperFunctions';

const BusScreen = () => {
	const state = useSelector(storeState => storeState.bus);
	// console.log(state);
	const dispatch = useDispatch();
	return (
		<>
			<View style={styles.topDropdowns}>
				<View style={{ flex: 1 }}>
					<Dropdown
						title="Type"
						items={state.busType.items}
						hideSearch={true}
						onSelectedItemChange={selectedItem =>
							dispatch({ type: CHANGE_TYPE, payload: selectedItem })
						}
						chosenItem={state.busType.selected}
					/>
				</View>
				<View style={{ flex: 1 }}>
					<Dropdown
						title="Day"
						items={state.dayType.items}
						hideSearch={true}
						onSelectedItemChange={selectedItem =>
							dispatch({ type: CHANGE_DAY, payload: selectedItem })
						}
						chosenItem={state.dayType.selected}
					/>
				</View>
			</View>
			<Dropdown
				title="From"
				items={state.busStops.items}
				searchPlaceholderText="Search a bus stop"
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_FROM, payload: selectedItem })
				}
				chosenItem={state.busStops.from}
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
				items={state.busStops.items}
				searchPlaceholderText="Search a bus stop"
				onSelectedItemChange={selectedItem =>
					dispatch({ type: CHANGE_TO, payload: selectedItem })
				}
				chosenItem={state.busStops.to}
			/>
			<TimetableCell
				firstColumnText={'From\nLeave At'}
				secondColumnText={'To\nArrive At'}
				isHeader
			/>
			<FlatList
				data={state.busStops.timetable}
				keyExtractor={time => time.leave}
				renderItem={({ item }) => {
					return (
						<TimetableCell
							firstColumnText={item.leave}
							secondColumnText={item.arrive}
							timeOut={() => dispatch({ type: REMOVE_TIME, payload: item })}
							dayType={getPropValue(
								state.dayType.items,
								state.dayType.selected,
								ID,
								NAME_ID
							)}
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
