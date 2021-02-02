import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults/index';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage
};

const {
	middleware: offlineMiddleware,
	enhanceReducer: offlineEnhanceReducer,
	enhanceStore: offlineEnhanceStore
} = createOffline({
	...offlineConfig,
	persist: false
});

const persistedReducer = persistReducer(
	persistConfig,
	offlineEnhanceReducer(rootReducer)
);

export const store = createStore(
	persistedReducer,
	composeWithDevTools(
		offlineEnhanceStore,
		applyMiddleware(thunk, offlineMiddleware)
	)
);
export const persistor = persistStore(store);
