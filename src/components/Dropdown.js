import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { MaterialIcons } from "@expo/vector-icons";

const Dropdown = ({ title, items }) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <SectionedMultiSelect
        items={items}
        IconRenderer={MaterialIcons}
        uniqueKey="id"
        subKey="children"
        hideConfirm
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderColor: "black",
    borderWidth: 15,
    justifyContent: "space-between",
  },
});

export default Dropdown;
