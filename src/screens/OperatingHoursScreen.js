import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeProvider, Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '../components/Dropdown';

const OperatingHoursScreen = () => {
	const state = useSelector(storeState => storeState.operatingHours);
	const dispatch = useDispatch();
	return (
		<View>
			<Dropdown
				title="Day"
				items={state.dayType.items}
				hideSearch={true}
				onSelectedItemChange={selectedItem =>
					dispatch({ type: 'operatingHoursDay', payload: selectedItem })
				}
				chosenItem={state.dayType.selected}
			/>
			<Dropdown
				title="Facility"
				items={state.facility.items}
				searchPlaceholderText="Search a facility"
				onSelectedItemChange={selectedItem =>
					dispatch({ type: 'changeFacility', payload: selectedItem })
				}
				chosenItem={state.facility.selected}
			/>
		</View>
	);
};

OperatingHoursScreen.navigationOptions = {
	title: 'Operating Hours'
};

const styles = StyleSheet.create({});

export default OperatingHoursScreen;
