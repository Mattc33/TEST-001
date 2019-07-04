import * as _ from 'lodash';
import * as moment from 'moment';

import { 
    IMeetingBook, 
    initialMeetingBook,
    IMeetingBookItem,
    initialMeetingBookItem,
    IAction
} from '../../../../models';

import { IMeetingBookState, initialMeetingBookState } from './meeting-book';
import * as actions from './MeetingBookActions';

export const MeetingBookReducer = 
    (state: IMeetingBookState = initialMeetingBookState, action: IAction): IMeetingBookState => {
    
    switch (action.type) {
        case actions.EventTypes.INITIALIZE_MEETING_BOOK: {

            const initMeetingBook = action as actions.InitializeMeetingBook;
            const initMeetingBookState: IMeetingBookState = {
                ...state,
                loading: true,
                initialized: false
            };

            return initMeetingBookState;

        }
        case actions.EventTypes.MEETING_BOOK_INITIALIZED: {

            const meetingBookInit = action as actions.MeetingBookInitialized;

            const meetingBookInitState: IMeetingBookState = {
                ...state,
                loading: false,
                initialized: true,
                selectedItem: _.cloneDeep(meetingBookInit.selectedItem),
                items: _.cloneDeep(meetingBookInit.items),
                meetingBook: _.cloneDeep(meetingBookInit.payload),
                error: meetingBookInit.error
            };

            return meetingBookInitState;
        }
        case actions.EventTypes.GET_MEETING_BOOK: {

            const getMeetingBook = action as actions.GetMeetingBook;
            const getMeetingBookState = {
                ...state,
                loading: true,
                error: null
            };

            return getMeetingBookState;
        }
        case actions.EventTypes.GOT_MEETING_BOOK: {
            
            const gotMeetingBook = action as actions.GotMeetingBook;
            const gotMeetingBookState: IMeetingBookState = {
                ...state,
                loading: false,
                error: gotMeetingBook.error,
                meetingBook: _.cloneDeep(gotMeetingBook.payload)
            };

            return gotMeetingBookState;
            
        }
        case actions.EventTypes.GET_MEETING_BOOK_ITEMS: {

            const getMeetingBookItems = action as actions.GetMeetingBookItems;

            const getMeetingBookItemsState: IMeetingBookState = {
                ...state,
               loading: true,
               error: null
            };

            return getMeetingBookItemsState;

        }
        case actions.EventTypes.GOT_MEETING_BOOK_ITEMS: {

            const gotMeetingBookItems = action as actions.GotMeetingBookItems;

            const gotMeetingBookState: IMeetingBookState = {
                ...state,
                loading: false,
                error: gotMeetingBookItems.error,
                items: _.cloneDeep(gotMeetingBookItems.payload)
            };

            return gotMeetingBookState;
            
        }
        case actions.EventTypes.SELECT_ITEM: {

            const selectItem = action as actions.SelectItem;

            const selectItemState: IMeetingBookState = {
                ...state,
                loading: true,
                selectedItem: null
            };

            return selectItemState;
        }
        case actions.EventTypes.ITEM_SELECTED: {

            const itemSelected = action as actions.ItemSelected;

            const itemSelectedState = {
                ...state,
                loading: false,
                selectedItem: _.cloneDeep(itemSelected.payload),
                error: itemSelected.error
            };

            return itemSelectedState;
        }
        default: {
            return state;
        }
    }
};
