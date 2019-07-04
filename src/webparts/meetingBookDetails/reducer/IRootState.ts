import {IMeetingBookManagerState, initialMeetingBookManagerState} from '../components/meeting-book-manager/meeting-book-manager';
import { IMeetingBookState, initialMeetingBookState } from '../components/meeting-book/meeting-book';
import { IMeetingBookItemsState, initialMeetingBookItemsState } from '../components/meeting-book-items/meeting-book-items';
import { IMeetingBookAddItemsState, initialMeetingBookAddItemsState } from '../components/meeting-book-add-items/meeting-book-add-items';

/**
 * @interface
 * The root state of the meeting book details.
 */
export interface IRootState {
    // Add application state objects...
    meetingBookManagerState: IMeetingBookManagerState;
    meetingBookState: IMeetingBookState;
    meetingBookItemsState: IMeetingBookItemsState;
    meetingBookAddItemsState: IMeetingBookAddItemsState;
}

export const initialRootState: IRootState = {
    meetingBookManagerState: initialMeetingBookManagerState,
    meetingBookState: initialMeetingBookState,
    meetingBookItemsState: initialMeetingBookItemsState,
    meetingBookAddItemsState: initialMeetingBookAddItemsState
};