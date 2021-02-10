// hooks
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// components
import { View, StyleSheet } from 'react-native';
import { Button, ThemeProvider, Icon, Text } from 'react-native-elements';

// helper functions and constants
import { getPropValue } from '../helperFunctions/commonFunctions';
import { getUpcomingTime } from '../helperFunctions/busHelper';
import { getOperatingHoursList } from '../helperFunctions/operatingHoursHelper';
import { getUpdates } from '../firebase';
import { NAME, TODAY, ID, NAME_ID, BUS_TYPES, DAY_TYPES } from '../constants';
import moment from 'moment-timezone';

const HomeScreen = ({ navigation }) => {
	// get bus and operating hour states from the store
	const busState = useSelector(storeState => storeState.bus);
	const ohState = useSelector(storeState => storeState.operatingHours);

	// create now state to keep track of current time
	const [now, setNow] = useState(moment().tz('Asia/Seoul'));
	useEffect(() => {
		getUpdates();
		const interval = setInterval(() => {
			setNow(moment().tz('Asia/Seoul'));
		}, 1000);
		return () => clearInterval(interval);
		// we need to clean up after a component is removed. Otherwise, memory leak.
	}, []);

	// following declarations are needed to render data
	const busOptions = busState.database.busOptions;
	const dayTypes = busOptions[DAY_TYPES];
	const busTypes = busOptions[BUS_TYPES];
	const busStopsClassfication = getPropValue(
		busTypes,
		busState.busType,
		ID,
		NAME_ID
	);
	const busStops = busOptions[busStopsClassfication];
	const upcomingBusTime = getUpcomingTime(
		busState,
		busTypes,
		busStops,
		now.format('HH:mm')
	);
	let from = getPropValue(busStops, busState.from, ID, NAME);
	let to = getPropValue(busStops, busState.to, ID, NAME);

	return (
		<View style={styles.container}>
			<ThemeProvider>
				<Text style={styles.text}>
					{upcomingBusTime !== undefined
						? `Next bus from ${from} to ${to} leaves at ${upcomingBusTime.leave}`
						: `No bus going from ${from} to ${to} today`}
				</Text>
				<Button
					icon={
						<Icon
							name="bus"
							type="font-awesome"
							size={20}
							color="white"
							iconStyle={styles.icon}
						/>
					}
					title="Bus Timetable"
					titleStyle={styles.title}
					onPress={() => navigation.navigate('Bus')}
				/>
				<Button
					icon={
						<Icon
							name="home"
							size={20}
							color="white"
							type="font-awesome"
							iconStyle={styles.icon}
						/>
					}
					title="Operating Hours"
					onPress={() => navigation.navigate('OperatingHours')}
					titleStyle={styles.title}
				/>
			</ThemeProvider>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center'
	},
	icon: {
		marginRight: 10
	},
	text: {
		marginHorizontal: 10,
		textAlign: 'center',
		marginBottom: 10,
		fontSize: 15
	}
});

export default HomeScreen;
