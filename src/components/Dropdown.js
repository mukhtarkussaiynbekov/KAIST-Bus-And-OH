import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const Dropdown = ({
	title,
	items,
	searchPlaceholderText,
	hideSearch,
	onSelectedItemChange,
	chosenItem,
	readOnlyHeadings
}) => {
	const [selectedItem, setSelectedItem] = useState([chosenItem]);
	if (selectedItem[0] !== chosenItem) {
		// when swap button is pressed, state is not updated.
		// So, we have to manually update its state.
		setSelectedItem([chosenItem]);
	}
	return (
		<View style={styles.viewContainer}>
			<Text style={styles.title}>{title}</Text>
			<View style={{ flex: 1 }}>
				<SectionedMultiSelect
					searchPlaceholderText={searchPlaceholderText}
					styles={styles}
					items={items}
					IconRenderer={MaterialIcons}
					uniqueKey="id"
					subKey="children"
					hideConfirm
					single
					hideSearch={hideSearch} // default value is false
					modalWithTouchable
					onSelectedItemsChange={selectedItem => {
						setSelectedItem(selectedItem);
						onSelectedItemChange(selectedItem[0]);
					}}
					selectedItems={selectedItem}
					readOnlyHeadings={readOnlyHeadings}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	viewContainer: {
		flexDirection: 'row',
		paddingLeft: 10
	},
	container: {
		marginTop: 100,
		paddingTop: 5
	},
	title: {
		alignSelf: 'center',
		fontSize: 16,
		width: 40,
		paddingBottom: 11
	},
	selectToggleText: {
		flex: 1
	}
});

export default Dropdown;
