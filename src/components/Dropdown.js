import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons } from '@expo/vector-icons';

const Dropdown = ({ title, items, searchPlaceholderText, hideSearch }) => {
	const [selectedItems, setSelectedItems] = useState([]);

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
					onSelectedItemsChange={selectedItems =>
						setSelectedItems(selectedItems)
					}
					selectedItems={selectedItems}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	viewContainer: {
		// borderColor: "black",
		// borderWidth: 15,
		flexDirection: 'row',
		paddingLeft: 10
	},
	container: {
		// backgroundColor: 'blue',
		// borderWidth: 15,
		// borderColor: 'black'
		marginTop: 100,
		paddingTop: 5
	},
	title: {
		// backgroundColor: 'red',
		alignSelf: 'center',
		fontSize: 16,
		width: 40,
		paddingBottom: 11
	},
	// selectToggle: {
	// 	backgroundColor: 'green'
	// 	// width: 200,
	// },
	selectToggleText: {
		flex: 1
		// width: 100,
		// color: 'yellow'
	}
	// modalWrapper: {
	// 	// backgroundColor: 'purple',
	// 	// marginTop: 20
	// }
});

export default Dropdown;
