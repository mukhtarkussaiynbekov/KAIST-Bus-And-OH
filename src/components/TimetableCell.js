import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';

const TimetableCell = () => {
	return (
		<View>
			<Text>From: Leave at</Text>
			<Text>To: Arrive at</Text>
			<Text>Time Left</Text>
			<TouchableOpacity>
				<Feather name="bell" size={20} />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({});

export default TimetableCell;
