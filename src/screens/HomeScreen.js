import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ThemeProvider, Icon, Text } from 'react-native-elements';
import { useSelector } from 'react-redux';

const HomeScreen = ({ navigation }) => {
	const state = useSelector(state => state);
	console.log(state);
	return (
		<View style={styles.container}>
			<ThemeProvider>
				{/* <Text>Next bus leaves at {state.busStops.timetable[0].leave}</Text> */}
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
