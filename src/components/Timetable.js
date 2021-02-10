import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

const Timetable = ({ header, timetable, renderFunction }) => {
	return (
		<>
			{header}
			<FlatList
				data={timetable}
				keyExtractor={(time, index) => index.toString()}
				renderItem={renderFunction}
			/>
		</>
	);
};

const styles = StyleSheet.create({});

export default Timetable;
