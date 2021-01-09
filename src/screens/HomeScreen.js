import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';

const HomeScreen = ({ navigation }) => {
	return (
		<ThemeProvider>
			<Button
				title="Bus Timetable"
				onPress={() => navigation.navigate('Bus')}
			/>
			<Button
				title="Operating Hours"
				onPress={() => navigation.navigate('OperatingHours')}
			/>
		</ThemeProvider>
	);
};

const styles = StyleSheet.create({});

export default HomeScreen;
