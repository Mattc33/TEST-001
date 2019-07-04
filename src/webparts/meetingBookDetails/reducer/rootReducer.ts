import { combineReducers, Reducer } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { MeetingBookManagerReducer } from '../components/meeting-book-manager/MeetingBookManagerReducer';
import { MeetingBookItemsReducer } from '../components/meeting-book-items/MeetingBookItemsReducer';
import { MeetingBookAddItemsReducer } from '../components/meeting-book-add-items/MeetingBookAddItemsReducer';
import { MeetingBookReducer } from '../components/meeting-book/MeetingBookReducer';

import { IRootState } from './IRootState';


export const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
    //router: routerReducer,
    
    // Add application reducers...
    meetingBookManagerState: MeetingBookManagerReducer, 
    meetingBookState: MeetingBookReducer,
    meetingBookItemsState: MeetingBookItemsReducer,
    meetingBookAddItemsState: MeetingBookAddItemsReducer,
    form: formReducer
    
});