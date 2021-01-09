import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemeProvider, Text } from 'react-native-elements';

const OperatingHoursScreen = () => {
	return (
		<ThemeProvider>
			<Text>Operating Hours Screen</Text>
		</ThemeProvider>
	);
};

OperatingHoursScreen.navigationOptions = {
	title: 'Operating Hours'
};

const styles = StyleSheet.create({});

export default OperatingHoursScreen;
