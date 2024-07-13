import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
	apiKey: 'AIzaSyA8omQL1w3mBoUdi6L0dJsjC02YeBZYCVM',
	authDomain: 'todo-list-3822e.firebaseapp.com',
	projectId: 'todo-list-3822e',
	storageBucket: 'todo-list-3822e.appspot.com',
	messagingSenderId: '354418438077',
	appId: '1:354418438077:web:f9a93b74003ca0ecccacd4',
	databaseURL: 'https://todo-list-3822e-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
