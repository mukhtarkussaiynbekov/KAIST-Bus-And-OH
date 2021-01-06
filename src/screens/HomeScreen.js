import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';

const HomeScreen = () => {
    return (
        <ThemeProvider>
            <Button title="Bus Timetable" />
            <Button title="Operating Hours" />
        </ThemeProvider>
    );
};

const styles = StyleSheet.create({});

export default HomeScreen;