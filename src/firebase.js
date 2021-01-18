import * as firebase from 'firebase';
import { DATA_FETCH_SUCCESS } from './constants';

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

export const getUpdates = dispatch => {
	firebase
		.database()
		.ref()
		.on('value', snapshot => {
			let database = snapshot.val();
			dispatch({ type: DATA_FETCH_SUCCESS, payload: database });
		});
};
