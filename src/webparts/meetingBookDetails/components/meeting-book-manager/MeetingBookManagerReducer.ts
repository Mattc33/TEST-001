import * as _ from 'lodash';
import * as moment from 'moment';

import { 
    IAction, 
    IMeetingBook, 
    initialMeetingBook 
} from '../../../../models';

import { IMeetingBookManagerState, initialMeetingBookManagerState } from './meeting-book-manager';
import * as actions from './MeetingBookManagerActions';

export const MeetingBookManagerReducer = 
    (state: IMeetingBookManagerState = initialMeetingBookManagerState, action: IAction): IMeetingBookManagerState => {
    
    switch (action.type) {
        case actions.EventTypes.GET_MEETING_BOOK: {

            const getMeetingBookEvent = action as actions.GetMeetingBook;

            const getMeetingBookState = {
                ...state,
               loading: true,
               error: null
            };

            return getMeetingBookState;

        }
        case actions.EventTypes.GOT_MEETING_BOOK: {

            const gotMeetingBookEvent = action as actions.GotMeetingBook;

            const gotMeetingBookState = {
                ...state,
                loading: false,
                error: gotMeetingBookEvent.error,
                meetingBook: _.cloneDeep(gotMeetingBookEvent.payload)
            };

            return gotMeetingBookState;
            
        }
        case actions.EventTypes.TOGGLE_EDIT_FORM: {

            const toggleEditModeEvent = action as actions.ToggleEditForm;

            const toggleEditModeState = {
                ...state,
                editMode: toggleEditModeEvent.editMode
            };

            return toggleEditModeState;

        }
        case actions.EventTypes.SAVE_MEETING_BOOK: {

            const saveMeetingBook = action as actions.SaveMeetingBook;

            const saveMeetingBookState = {
                ...state
            };

            return saveMeetingBookState;

        }
        case actions.EventTypes.MEETING_BOOK_SAVED: {
            
            const meetingBookSavedEvent = action as actions.MeetingBookSaved;

            const meetingBookSavedState = {
                ...state,
                meetingBook: _.cloneDeep(meetingBookSavedEvent.payload),
                error: meetingBookSavedEvent.error
            };

            return meetingBookSavedState;

        }
        default: {
            return state;
        }
    }
};
