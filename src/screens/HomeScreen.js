import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';

const HomeScreen = ({ navigation }) => {
	return (
		<View style={styles.container}>
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
	}
});

export default HomeScreen;
