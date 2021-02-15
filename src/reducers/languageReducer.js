import { CHANGE_LANGUAGE, LANGUAGES, NAME_ID, ID, KOREAN } from '../constants';
import languages from '../json/languages.json';
import { getPropValue } from '../helperFunctions/commonFunctions';

const INITIAL_STATE = {
	items: languages[LANGUAGES],
	selected: getPropValue(languages[LANGUAGES], KOREAN, NAME_ID, ID)
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHANGE_LANGUAGE:
			return { ...state, selected: action.payload };
		default:
			return state;
	}
};
