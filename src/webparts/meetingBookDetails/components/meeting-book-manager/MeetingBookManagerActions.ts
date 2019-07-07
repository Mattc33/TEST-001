import { 
    ICompletedAction, 
    ITriggerAction, 
    IAction, 
    IMeetingBook, 
    MeetingBookViewType 
} from '../../../../models';

export const EventTypes = {

    GET_MEETING_BOOK: 'Meeting_Book_Manager/GET_MEETING_BOOK',
    GOT_MEETING_BOOK: 'Meeting_Book_Manager/GOT_MEETING_BOOK',

    TOGGLE_EDIT_FORM: 'Meeting_Book_Manager/TOGGLE_EDIT_FORM',

    SAVE_MEETING_BOOK: 'Meeting_Book_Manager/SAVE_MEETING_BOOK',
    MEETING_BOOK_SAVED:'Meeting_Book_Manager/MEETING_BOOK_SAVED',

    QUERY_USERS: 'Meeting_Book_Manager/QUERY_USERS',
    USERS_QUERIED: 'Meeting_Book_Manager/USERS_QUERIED',

    CHANGE_LAYOUT_VIEW: 'Meeting_Book_Manager/CHANGE_LAYOUT_VIEW'

};

export interface ChangeLayoutView extends ITriggerAction {
    view: MeetingBookViewType;
}

export interface GetMeetingBook extends ITriggerAction {
    id: number;
}

export interface GotMeetingBook extends ICompletedAction<IMeetingBook> {
}

export interface ToggleEditForm extends ITriggerAction {
    editMode: boolean;
}

export interface SaveMeetingBook extends ITriggerAction {
    meetingBook: IMeetingBook;
}

export interface MeetingBookSaved extends ICompletedAction<IMeetingBook> {
    
}

export interface QueryUsers extends ITriggerAction {
    keyword: string;
}

export interface UsersQueried extends ICompletedAction<Array<any>> {
    
}