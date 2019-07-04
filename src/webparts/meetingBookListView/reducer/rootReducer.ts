import { combineReducers, Reducer } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { MeetingBookListViewReducer } from '../components/meeting-book-list-view/MeetingBookListViewReducer';

import { IRootState } from './IRootState';


export const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
    // Add application reducers...
    meetingBookListViewState: MeetingBookListViewReducer,
    form: formReducer
});