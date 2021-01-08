import React from "react";
import { View } from "react-native";
import { Button, ThemeProvider, Text } from "react-native-elements";
import Dropdown from "../components/Dropdown";

const busStops = [
  // this is the parent or 'item'
  {
    name: "Main Campus (본교)",
    id: 1,
    // these are the children or 'sub items'
    children: [
      {
        name: "N6",
        id: 11,
      },
      {
        name: "Auditorium",
        id: 12,
      },
      {
        name: "W8",
        id: 13,
      },
      {
        name: "Duck pond",
        id: 14,
      },
    ],
  },
  {
    name: "Munji Campus (문지)",
    id: 2,
  },
  {
    name: "Hwaam Campus (화암)",
    id: 3,
  },
  {
    name: "Rothen House (로덴 하우스)",
    id: 4,
  },
  {
    name: "Faculty Apartment (교수 아파트)",
    id: 5,
  },
  {
    name: "Chungnam National University (충남태학교)",
    id: 6,
  },
  {
    name: "Wolpyeong St. Exit #1",
    id: 7,
  },
  {
    name: "Galleria Department Store",
    id: 8,
  },
  {
    name: "Government Complex",
    id: 9,
  },
  {
    name: "Wolpyeong St. Exit #3",
    id: 10,
  },
];

const BusScreen = () => {
  return (
    <View>
      <Text>Bus Screen</Text>
      <Dropdown
        title="From"
        items={busStops}
        searchPlaceholderText="Search a bus stop"
      />
      <Dropdown
        title="To"
        items={busStops}
        searchPlaceholderText="Search a bus stop"
      />
    </View>
  );
};

//const styles = StyleSheet.create({});

export default BusScreen;
