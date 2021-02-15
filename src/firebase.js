import * as firebase from 'firebase';
import { DATA_FETCH_SUCCESS } from './constants';
import busOptionsEnglishLocal from './json/busData/options/english.json';
import busOptionsKoreanLocal from './json/busData/options/korean.json';
import busTimetableLocal from './json/busData/busTimetable.json';
import busTravelTimesLocal from './json/busData/busTravelTimes.json';
import holidaysLocal from './json/holidays.json';
import ohOptionsEnglishLocal from './json/operatingHoursData/options/english.json';
import ohOptionsKoreanLocal from './json/operatingHoursData/options/korean.json';
import operatingHoursLocal from './json/operatingHoursData/operatingHours.json';

// Initialize Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyDW-h7c2D--spXqQ-mB04nV6cr10lTghiQ',
	authDomain: 'kaist-times.firebaseapp.com',
	databaseURL: 'https://kaist-times-default-rtdb.firebaseio.com',
	projectId: 'kaist-times',
	storageBucket: 'kaist-times.appspot.com',
	messagingSenderId: '261995898468',
	appId: '1:261995898468:web:3135e964eb420b0246a171',
	measurementId: 'G-0SXVPGY5YK'
};

if (firebase.apps.length === 0) {
	firebase.initializeApp(firebaseConfig);
}

export const getUpdates = () => {
	return dispatch => {
		firebase
			.database()
			.ref()
			.on('value', snapshot => {
				let database = snapshot.val();
				dispatch({ type: DATA_FETCH_SUCCESS, payload: database });
			});
	};
};

export const writeData = () => {
	return () => {
		firebase
			.database()
			.ref('busData/options/english')
			.set(busOptionsEnglishLocal);
		firebase
			.database()
			.ref('busData/options/korean')
			.set(busOptionsKoreanLocal);
		firebase.database().ref('busData/timetable').set(busTimetableLocal);
		firebase.database().ref('busData/travelTimes/').set(busTravelTimesLocal);
		firebase.database().ref('holidays/').set(holidaysLocal);
		firebase
			.database()
			.ref('ohData/options/english')
			.set(ohOptionsEnglishLocal);
		firebase.database().ref('ohData/options/korean').set(ohOptionsKoreanLocal);
		firebase.database().ref('ohData/operatingHours/').set(operatingHoursLocal);
	};
};
