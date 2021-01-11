import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<ThemeProvider>
				<Button
					icon={<Icon name="bus" size={15} color="white" />}
					iconContainerStyle={styles.icon}
					title="Bus Timetable"
					titleStyle={styles.title}
					onPress={() => navigation.navigate('Bus')}
				/>
				<Button
					icon={<Icon name="home" size={15} color="white" />}
					iconContainerStyle={styles.icon}
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
		borderColor: 'yellow',
		borderWidth: 10
	},
	title: {
		// borderColor: 'red',
		// borderWidth: 10,
		marginLeft: 10
	}
});

export default HomeScreen;
