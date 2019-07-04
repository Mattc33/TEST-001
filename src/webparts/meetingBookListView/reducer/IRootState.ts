import { IMeetingBookListViewState, initialMeetingBookListViewState } from '../components/meeting-book-list-view/meeting-book-list-view';


/**
 * @interface
 * The root state of the meeting book details.
 */
export interface IRootState {
    // Add application state objects...
    meetingBookListViewState: IMeetingBookListViewState;
}

export const initialRootState: IRootState = {
   meetingBookListViewState: initialMeetingBookListViewState
};