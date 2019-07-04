import { ICompletedAction, ITriggerAction, IAction } from '../../../../models';
import { IMeetingBook, IMeetingBookResponse, MeetingBookType, MeetingBookFilterType } from '../../../../models';

export const EventTypes = {

    INITIALIZE_MEETING_BOOK_LIST: 'Meeting_Book_View/INITIALIZE_MEETING_BOOK_LIST',
    MEETING_BOOK_LIST_INITIALIZED: 'Meeting_Book_View/MEETING_BOOK_LIST_INITIALIZED',

    FILTER_MEETING_BOOKS: 'Meeting_Book_View/FILTER_MEETING_BOOKS',
    MEETING_BOOKS_FILTERED: 'Meeting_Book_View/MEETING_BOOKS_FILTERED',

    OPEN_NEW_MEETING_BOOK_FORM: 'Meeting_Book_View/OPEN_NEW_MEETING_BOOK_FORM',
    CLOSE_NEW_MEETING_BOOK_FORM: 'Meeting_Book_View/CLOSE_NEW_MEETING_BOOK_FORM',

    ADD_MEETING_BOOK: 'Meeting_Book_View/ADD_MEETING_BOOK',
    MEETING_BOOK_ADDED: 'Meeting_Book_View/MEETING_BOOK_ADDED',
    
    DELETE_MEETING_BOOKS: 'Meeting_Book_View/DELETE_MEETING_BOOKS',
    MEETING_BOOKS_DELETED: 'Meeting_Book_View/MEETING_BOOKS_DELETED',
    
    SORT_MEETING_BOOKS: 'Meeting_Book_View/SORT_MEETING_BOOKS',
    MEETING_BOOKS_SORTED: 'Meeting_Book_View/MEETING_BOOKS_SORTED',

    PAGE_MEETING_BOOKS: 'Meeting_Book_View/PAGE_MEETING_BOOKS',
    MEETING_BOOKS_PAGEDONE: 'Meeting_Book_View/MEETING_BOOKS_PAGEDONE',

    CLONE_MEETING_BOOKS: 'Meeting_Book_View/CLONE_MEETING_BOOKS',
    MEETING_BOOKS_CLONED: 'Meeting_Book_View/MEETING_BOOKS_CLONED'
};

export interface InitializeMeetingBookList extends ITriggerAction {
}

export interface MeetingBookInitialized extends ICompletedAction<IMeetingBookResponse> {
}

export interface SortMeetingBooks extends ITriggerAction {
    sortField: string;
    sortAscending: boolean;
}

export interface MeetingBooksSorted extends ICompletedAction<IMeetingBookResponse> {
    sortField: string;
    sortAscending: boolean;
}

export interface PageMeetingBooks extends ITriggerAction {
    nextPage: string;
    pageNum: number;
}

export interface MeetingBooksPagingDone extends ICompletedAction<IMeetingBookResponse> {
    nextPage: string;
    pageNum: number;
}

export interface FilterMeetingBooks extends ITriggerAction {
    filter: MeetingBookFilterType;
}

export interface MeetingBooksFiltered extends ICompletedAction<IMeetingBookResponse> {
    filter: MeetingBookFilterType;
}

export interface OpenNewMeetingBookForm extends ITriggerAction {

}

export interface CloseNewMeetingBookForm extends ITriggerAction {
    
}

export interface AddMeetingBook extends ITriggerAction {
    meetingBook: IMeetingBook;
}

export interface MeetingBookAdded extends ICompletedAction<IMeetingBook> {

}

export interface DeleteMeetingBook extends ITriggerAction {
    meetingBookIds: Array<number>;
}

export interface MeetintBookDeleted extends ICompletedAction<null> {

}

export interface CloneMeetingBook extends ITriggerAction {
    meetingBookId: number;
}

export interface MeetintBookCloned extends ICompletedAction<null> {

}