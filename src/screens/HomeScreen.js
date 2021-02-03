import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ThemeProvider, Icon, Text } from 'react-native-elements';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import { getPropValue, getUpcomingTime } from '../reducers/helperFunctions';
import { NAME, TODAY, ID, NAME_ID, BUS_TYPES, DAY_TYPES } from '../constants';
import { getUpdates } from '../firebase';

const HomeScreen = ({ navigation }) => {
	const storeState = useSelector(storeState => storeState);
	const [now, setNow] = useState(moment().tz('Asia/Seoul'));
	useEffect(() => {
		getUpdates();
		const interval = setInterval(() => {
			setNow(moment().tz('Asia/Seoul'));
		}, 1000);
		return () => clearInterval(interval);
		// we need to clean up after a component is removed. Otherwise, memory leak.
	}, []);

	const busState = storeState.bus;
	const busOptions = busState.database.busOptions;
	const dayTypes = busOptions[DAY_TYPES];
	const busStopsClassfication = getPropValue(
		busOptions[BUS_TYPES],
		busState.busType,
		ID,
		NAME_ID
	);
	const busStops = busOptions[busStopsClassfication];
	const upcomingBusTime = getUpcomingTime({
		...storeState.bus,
		dayType: getPropValue(dayTypes, TODAY, NAME_ID, ID)
	});
	let from = getPropValue(busStops, busState.from, ID, NAME);
	let to = getPropValue(busStops, busState.to, ID, NAME);

	return (
		<View style={styles.container}>
			<ThemeProvider>
				<Text>
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
		// alignItems: 'center',
		justifyContent: 'center'
		// borderColor: 'red',
		// borderWidth: 10
	},
	icon: {
		// borderColor: 'yellow',
		// borderWidth: 10,
		marginRight: 10
	},
	title: {
		// borderColor: 'red',
		// borderWidth: 10,
		// marginLeft: 10
	}
});

export default HomeScreen;
