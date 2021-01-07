import React from 'react';
import { Button, ThemeProvider, Text } from 'react-native-elements';
import {MaterialIcons} from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const busStops = [
  // this is the parent or 'item'
  {
    name: 'Main Campus (본교)',
    id: 1,
    // these are the children or 'sub items'
    children: [
      {
        name: 'N6',
        id: 11
      },
      {
        name: 'Auditorium',
        id: 12
      },
      {
        name: 'W8',
        id: 13
      },
      {
        name: 'Duck pond',
        id: 14
      }
    ]
  },
  {
    name: 'Munji Campus (문지)',
    id: 2
  },
  {
    name: 'Hwaam Campus (화암)',
    id: 3
  },
  {
    name: 'Rothen House (로덴 하우스)',
    id: 4
  },
  {
    name: 'Faculty Apartment (교수 아파트)',
    id: 5
  },
  {
    name: 'Chungnam National University',
    id: 6
  },
  {
    name: 'Wolpyeong St. Exit #1',
    id: 7
  },
  {
    name: 'Galleria Department Store',
    id: 8
  },
  {
    name: 'Government Complex',
    id: 9
  },
  {
    name: 'Wolpyeong St. Exit #3',
    id: 10
  }
];

const BusScreen = () => {
  return (
    <ThemeProvider>
      <Text>Bus Screen</Text>
      <SectionedMultiSelect
        items={busStops}
        IconRenderer={MaterialIcons}
        uniqueKey="id"
        subKey="children"
        hideConfirm
      />
    </ThemeProvider>
  );
};

//const styles = StyleSheet.create({});

export default BusScreen;